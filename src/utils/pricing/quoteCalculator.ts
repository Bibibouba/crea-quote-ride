
import { Vehicle, PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { calculateDayNightKmSplit } from './timeUtils';
import { calculateNightSurcharge } from './nightRateCalculator';
import { calculateSundaySurcharge } from './sundayRateCalculator';
import { calculateVatAndTotalPrices } from './vatCalculator';
import { applyMinimumFare } from './minFareCalculator';
import { calculateWaitingTimePrice } from './calculateWaitingTimePrice';
import { calculateNightRate } from './calculators/nightRateCalculator';
import { calculateSundayRate } from './calculators/sundayRateCalculator';
import { calculateMinFare } from './calculators/minFareCalculator';
import { calculateVAT } from './calculators/vatCalculator';
import { calculateReturnTripDetails } from './calculators/returnTripCalculator';

// This function calculates all the pricing details for a quote
export const calculateQuoteDetails = (
  selectedVehicleId: string,
  estimatedDistance: number,
  returnDistance: number,
  hasReturnTrip: boolean,
  returnToSameAddress: boolean,
  vehicles: Vehicle[],
  hasWaitingTime: boolean,
  waitingTimePrice: number,
  time: string,
  date: Date,
  pricingSettings: PricingSettings
): QuoteDetails => {
  console.log("Calculating quote details for:", {
    selectedVehicleId,
    estimatedDistance,
    returnDistance,
    hasReturnTrip,
    returnToSameAddress,
    hasWaitingTime,
    waitingTimePrice,
    time,
    date
  });

  // Find the selected vehicle
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  if (!selectedVehicle) {
    console.error("Selected vehicle not found");
    return {
      oneWayPrice: 0,
      returnPrice: 0,
      waitingTimePrice: 0,
      totalPrice: 0,
      nightSurcharge: 0
    };
  }

  // Use vehicle or global pricing settings
  const basePrice = selectedVehicle.basePrice || pricingSettings.base_fare || 0;
  const minFare = selectedVehicle.minimum_trip_fare || pricingSettings.minimum_trip_fare || 0;
  const minDistance = selectedVehicle.min_trip_distance || 0;
  const hasMinDistanceWarning = minDistance > 0 && estimatedDistance < minDistance;
  
  // Use global VAT rates or defaults
  const rideVatRate = pricingSettings.ride_vat_rate || 0;
  const waitingVatRate = pricingSettings.waiting_vat_rate || 0;
  
  // Calculate day/night split for one-way trip
  const departureTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  departureTime.setHours(hours, minutes, 0, 0);
  
  const dayNightSplit = calculateDayNightKmSplit(
    departureTime,
    estimatedDistance, 
    selectedVehicle.night_rate_start || pricingSettings.night_rate_start,
    selectedVehicle.night_rate_end || pricingSettings.night_rate_end
  );
  
  const {
    dayKm,
    nightKm,
    dayPercentage,
    nightPercentage,
    totalKm
  } = dayNightSplit;
  
  // Add missing properties for compatibility
  const nightHours = dayNightSplit.nightHours || 0;
  const dayHours = dayNightSplit.dayHours || 0;
  const totalMinutes = dayNightSplit.totalMinutes || 0;

  console.log("Day/Night split for one-way trip:", {
    dayKm, nightKm, dayPercentage, nightPercentage, nightHours, dayHours
  });

  // Calculate night rate for one-way trip
  const {
    isNightRate,
    nightRatePercentage,
    dayPrice,
    nightPrice,
    nightSurcharge,
    totalWithNightRate: oneWayPriceWithNightRate
  } = calculateNightRate(
    basePrice, 
    dayKm, 
    nightKm, 
    selectedVehicle.night_rate_enabled || pricingSettings.night_rate_enabled,
    selectedVehicle.night_rate_percentage || pricingSettings.night_rate_percentage
  );

  // Calculate return trip details if needed
  const {
    returnDayKm,
    returnNightKm,
    returnDayPercentage,
    returnNightPercentage,
    returnNightHours,
    returnDayHours,
    returnTotalKm,
    isReturnNightRate,
    returnNightRatePercentage,
    returnDayPrice,
    returnNightPrice,
    returnNightSurcharge,
    returnPriceWithNightRate
  } = calculateReturnTripDetails(
    hasReturnTrip,
    returnToSameAddress,
    estimatedDistance,
    returnDistance,
    departureTime,
    selectedVehicle,
    pricingSettings,
    estimatedDistance / 60 * 60, // Estimated duration in minutes
    hasWaitingTime,
    hasWaitingTime ? 15 : 0 // Default to 15 minutes if waiting time is enabled
  );

  // Calculate Sunday/holiday rate
  const isSunday = date.getDay() === 0; // 0 is Sunday
  const sundayRate = selectedVehicle.holiday_sunday_percentage || pricingSettings.holiday_sunday_percentage || 0;
  
  const {
    sundaySurcharge,
    totalWithSunday: oneWayPriceWithSunday
  } = calculateSundayRate(oneWayPriceWithNightRate, isSunday, sundayRate);
  
  // Apply Sunday rate to return trip if needed
  let returnPriceWithSunday = returnPriceWithNightRate;
  if (hasReturnTrip && isSunday) {
    const returnSundayResult = calculateSundayRate(returnPriceWithNightRate, isSunday, sundayRate);
    returnPriceWithSunday = returnSundayResult.totalWithSunday;
  }
  
  // Calculate final prices
  const oneWayPrice = Math.max(oneWayPriceWithSunday, hasMinDistanceWarning ? minFare : 0);
  const returnPrice = hasReturnTrip ? returnPriceWithSunday : 0;
  
  // Calculate VAT
  const oneWayPriceHT = calculateVAT(oneWayPrice, rideVatRate, false);
  const returnPriceHT = calculateVAT(returnPrice, rideVatRate, false);
  const waitingTimePriceHT = calculateVAT(waitingTimePrice, waitingVatRate, false);
  
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  const totalVAT = (oneWayPrice - oneWayPriceHT) + (returnPrice - returnPriceHT) + (waitingTimePrice - waitingTimePriceHT);
  
  // Calculate total price
  const totalPrice = oneWayPrice + returnPrice + waitingTimePrice;
  
  // Apply minimum fare if needed
  const { finalPrice } = calculateMinFare(totalPrice, minFare);
  
  // Night hours display
  const nightStartHour = selectedVehicle.night_rate_start || pricingSettings.night_rate_start || "20:00";
  const nightEndHour = selectedVehicle.night_rate_end || pricingSettings.night_rate_end || "06:00";
  
  return {
    basePrice,
    isNightRate,
    isSunday,
    oneWayPriceHT,
    returnPriceHT,
    waitingTimePriceHT,
    totalPriceHT,
    totalVAT,
    oneWayPrice,
    returnPrice,
    waitingTimePrice,
    totalPrice: finalPrice,
    nightSurcharge,
    sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning,
    minDistance,
    nightRatePercentage,
    nightHours,
    dayHours,
    nightStartDisplay: nightStartHour,
    nightEndDisplay: nightEndHour,
    dayKm,
    nightKm,
    totalKm,
    dayPrice,
    nightPrice,
    sundayRate,
    waitTimeDay: 0, // These would need to be calculated based on waiting time
    waitTimeNight: 0,
    waitPriceDay: 0,
    waitPriceNight: 0,
    dayPercentage,
    nightPercentage,
    // Return trip specific fields
    returnDayKm,
    returnNightKm,
    returnTotalKm,
    returnDayPrice,
    returnNightPrice,
    returnNightSurcharge,
    isReturnNightRate,
    returnNightHours,
    returnDayHours,
    returnDayPercentage,
    returnNightPercentage
  };
};
