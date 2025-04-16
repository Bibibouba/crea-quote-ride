
import { Vehicle, PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { calculateDayNightKmSplit } from './timeUtils';
import { calculateNightRate } from './nightRateCalculator';
import { calculateSundayRate } from './sundayRateCalculator';
import { calculateVAT } from './vatCalculator';
import { calculateMinFare } from './minFareCalculator';
import { calculateWaitingTimePrice } from './calculateWaitingTimePrice';

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
  
  const {
    dayKm,
    nightKm,
    dayPercentage,
    nightPercentage,
    nightHours,
    dayHours,
    totalKm,
    totalMinutes
  } = calculateDayNightKmSplit(
    departureTime,
    estimatedDistance, 
    selectedVehicle.night_rate_start || pricingSettings.night_rate_start,
    selectedVehicle.night_rate_end || pricingSettings.night_rate_end
  );

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

  // Calculate day/night split for return trip
  let returnDayKm = 0;
  let returnNightKm = 0;
  let returnDayPercentage = 0;
  let returnNightPercentage = 0;
  let returnNightHours = 0;
  let returnDayHours = 0;
  let returnTotalKm = 0;
  let isReturnNightRate = false;
  let returnNightRatePercentage = 0;
  let returnDayPrice = 0;
  let returnNightPrice = 0;
  let returnNightSurcharge = 0;
  let returnPriceWithNightRate = 0;

  if (hasReturnTrip) {
    // Calculate the estimated arrival time to determine when the return trip will start
    // Assuming 1 hour = 60km for simplicity, adjust based on your requirements
    const estimatedDurationMinutes = estimatedDistance / 60 * 60; // km / (km/h) * 60 min/h
    const arrivalTime = new Date(departureTime.getTime() + estimatedDurationMinutes * 60 * 1000);
    
    // If there's waiting time, add it to the arrival time to get the return start time
    const returnStartTime = new Date(arrivalTime.getTime() + (hasWaitingTime ? waitingTimeMinutes * 60 * 1000 : 0));
    
    console.log("Return trip timing:", {
      departureTime: departureTime.toLocaleTimeString(),
      arrivalTime: arrivalTime.toLocaleTimeString(),
      returnStartTime: returnStartTime.toLocaleTimeString(),
      estimatedDurationMinutes,
      waitingTimeMinutes: hasWaitingTime ? waitingTimeMinutes : 0
    });

    const returnTripDistance = returnToSameAddress ? estimatedDistance : returnDistance;
    
    const returnSplit = calculateDayNightKmSplit(
      returnStartTime,
      returnTripDistance,
      selectedVehicle.night_rate_start || pricingSettings.night_rate_start,
      selectedVehicle.night_rate_end || pricingSettings.night_rate_end
    );
    
    returnDayKm = returnSplit.dayKm;
    returnNightKm = returnSplit.nightKm;
    returnDayPercentage = returnSplit.dayPercentage;
    returnNightPercentage = returnSplit.nightPercentage;
    returnNightHours = returnSplit.nightHours;
    returnDayHours = returnSplit.dayHours;
    returnTotalKm = returnSplit.totalKm;
    
    console.log("Day/Night split for return trip:", {
      returnDayKm, returnNightKm, returnDayPercentage, returnNightPercentage, returnNightHours, returnDayHours
    });
    
    // Calculate night rate for return trip
    const returnNightRateResult = calculateNightRate(
      basePrice, 
      returnDayKm, 
      returnNightKm, 
      selectedVehicle.night_rate_enabled || pricingSettings.night_rate_enabled,
      selectedVehicle.night_rate_percentage || pricingSettings.night_rate_percentage
    );
    
    isReturnNightRate = returnNightRateResult.isNightRate;
    returnNightRatePercentage = returnNightRateResult.nightRatePercentage;
    returnDayPrice = returnNightRateResult.dayPrice;
    returnNightPrice = returnNightRateResult.nightPrice;
    returnNightSurcharge = returnNightRateResult.nightSurcharge;
    returnPriceWithNightRate = returnNightRateResult.totalWithNightRate;
  }

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
