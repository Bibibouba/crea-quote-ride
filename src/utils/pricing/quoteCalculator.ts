
import { Vehicle, PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { calculateTripPrice } from './calculators/tripPriceCalculator';
import { calculateGlobalPrice } from './calculators/globalPriceCalculator';
import { calculateReturnTripDetails } from './calculators/returnTripCalculator';
import { calculateDetailedWaitingPrice } from './calculateWaitingTimePrice';

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

  // Find selected vehicle
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

  // Validate date
  const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  // Set up departure time
  const departureTime = new Date(validDate);
  const [hours, minutes] = time.split(':').map(Number);
  departureTime.setHours(hours, minutes, 0, 0);

  // Calculate one-way trip pricing
  const oneWayTripPrice = calculateTripPrice(
    departureTime,
    estimatedDistance,
    selectedVehicle,
    pricingSettings
  );

  // Calculate waiting time details if needed
  const waitingTimeDetails = hasWaitingTime ? 
    calculateDetailedWaitingPrice(
      hasWaitingTime,
      waitingTimePrice,
      pricingSettings,
      time,
      validDate,
      selectedVehicle,
      selectedVehicle.wait_night_enabled
    ) : {
      waitTimeDay: 0,
      waitTimeNight: 0,
      waitPriceDay: 0,
      waitPriceNight: 0,
      totalWaitPrice: 0,
      waitEndTime: null
    };

  // Calculate return trip pricing if needed using the waiting time end time
  const returnTripDetails = calculateReturnTripDetails(
    hasReturnTrip,
    returnToSameAddress,
    estimatedDistance,
    returnDistance,
    departureTime,
    selectedVehicle,
    pricingSettings,
    (estimatedDistance / 60) * 60,
    hasWaitingTime,
    waitingTimePrice,
    waitingTimeDetails.waitEndTime
  );

  // Calculate final prices including VAT and Sunday rates
  const isSunday = validDate.getDay() === 0;
  const globalPrices = calculateGlobalPrice(
    validDate,
    oneWayTripPrice.totalPriceWithNightRate,
    returnTripDetails.returnPriceWithNightRate,
    waitingTimeDetails.totalWaitPrice,
    selectedVehicle,
    pricingSettings,
    isSunday
  );

  // Return complete quote details
  return {
    basePrice: selectedVehicle.basePrice || pricingSettings.base_fare || 0,
    isNightRate: oneWayTripPrice.isNightRate,
    isSunday,
    oneWayPriceHT: oneWayTripPrice.totalPriceWithNightRate,
    returnPriceHT: returnTripDetails.returnPriceWithNightRate,
    waitingTimePriceHT: waitingTimeDetails.totalWaitPrice,
    ...globalPrices,
    nightSurcharge: oneWayTripPrice.nightSurcharge + returnTripDetails.returnNightSurcharge,
    hasMinDistanceWarning: selectedVehicle.min_trip_distance ? estimatedDistance < selectedVehicle.min_trip_distance : false,
    minDistance: selectedVehicle.min_trip_distance || 0,
    nightRatePercentage: oneWayTripPrice.nightRatePercentage,
    nightHours: oneWayTripPrice.nightHours,
    dayHours: oneWayTripPrice.dayHours,
    nightStartDisplay: selectedVehicle.night_rate_start || pricingSettings.night_rate_start,
    nightEndDisplay: selectedVehicle.night_rate_end || pricingSettings.night_rate_end,
    dayKm: oneWayTripPrice.dayKm,
    nightKm: oneWayTripPrice.nightKm,
    totalKm: oneWayTripPrice.totalKm,
    dayPrice: oneWayTripPrice.dayPrice,
    nightPrice: oneWayTripPrice.nightPrice,
    waitTimeDay: waitingTimeDetails.waitTimeDay,
    waitTimeNight: waitingTimeDetails.waitTimeNight,
    waitPriceDay: waitingTimeDetails.waitPriceDay,
    waitPriceNight: waitingTimeDetails.waitPriceNight,
    dayPercentage: oneWayTripPrice.dayPercentage,
    nightPercentage: oneWayTripPrice.nightPercentage,
    oneWayPrice: oneWayTripPrice.totalPriceWithNightRate,
    returnPrice: returnTripDetails.returnPriceWithNightRate,
    waitingTimePrice: waitingTimeDetails.totalWaitPrice,
    ...returnTripDetails
  };
};
