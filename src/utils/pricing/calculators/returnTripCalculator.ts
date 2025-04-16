
import { calculateDayNightKmSplit } from '../timeUtils';
import { calculateNightRate } from './nightRateCalculator';

/**
 * Calculates return trip details including day/night split
 */
export const calculateReturnTripDetails = (
  hasReturnTrip: boolean,
  returnToSameAddress: boolean,
  estimatedDistance: number,
  returnDistance: number,
  departureTime: Date,
  selectedVehicle: any,
  pricingSettings: any,
  estimatedDurationMinutes: number,
  hasWaitingTime: boolean,
  waitingTimeMinutes: number
) => {
  if (!hasReturnTrip) {
    return {
      returnDayKm: 0,
      returnNightKm: 0,
      returnDayPercentage: 0,
      returnNightPercentage: 0,
      returnNightHours: 0,
      returnDayHours: 0,
      returnTotalKm: 0,
      isReturnNightRate: false,
      returnNightRatePercentage: 0,
      returnDayPrice: 0,
      returnNightPrice: 0,
      returnNightSurcharge: 0,
      returnPriceWithNightRate: 0
    };
  }
  
  // Calculate the estimated arrival time to determine when the return trip will start
  const arrivalTime = new Date(departureTime.getTime() + estimatedDurationMinutes * 60 * 1000);
  
  // If there's waiting time, add it to the arrival time to get the return start time
  const waitingTimeMinutesValue = hasWaitingTime ? waitingTimeMinutes : 0;
  const returnStartTime = new Date(arrivalTime.getTime() + (waitingTimeMinutesValue * 60 * 1000));
  
  console.log("Return trip timing:", {
    departureTime: departureTime.toLocaleTimeString(),
    arrivalTime: arrivalTime.toLocaleTimeString(),
    returnStartTime: returnStartTime.toLocaleTimeString(),
    estimatedDurationMinutes,
    waitingTimeMinutes: waitingTimeMinutesValue
  });

  const returnTripDistance = returnToSameAddress ? estimatedDistance : returnDistance;
  
  const returnSplit = calculateDayNightKmSplit(
    returnStartTime,
    returnTripDistance,
    selectedVehicle.night_rate_start || pricingSettings.night_rate_start,
    selectedVehicle.night_rate_end || pricingSettings.night_rate_end
  );
  
  const returnDayKm = returnSplit.dayKm;
  const returnNightKm = returnSplit.nightKm;
  const returnDayPercentage = returnSplit.dayPercentage;
  const returnNightPercentage = returnSplit.nightPercentage;
  const returnNightHours = returnSplit.nightHours || 0;
  const returnDayHours = returnSplit.dayHours || 0;
  const returnTotalKm = returnSplit.totalKm;
  
  console.log("Day/Night split for return trip:", {
    returnDayKm, returnNightKm, returnDayPercentage, returnNightPercentage, returnNightHours, returnDayHours
  });
  
  // Calculate night rate for return trip
  const returnNightRateResult = calculateNightRate(
    selectedVehicle.basePrice || pricingSettings.base_fare || 0, 
    returnDayKm, 
    returnNightKm, 
    selectedVehicle.night_rate_enabled || pricingSettings.night_rate_enabled,
    selectedVehicle.night_rate_percentage || pricingSettings.night_rate_percentage
  );
  
  return {
    returnDayKm,
    returnNightKm,
    returnDayPercentage,
    returnNightPercentage,
    returnNightHours,
    returnDayHours,
    returnTotalKm,
    isReturnNightRate: returnNightRateResult.isNightRate,
    returnNightRatePercentage: returnNightRateResult.nightRatePercentage,
    returnDayPrice: returnNightRateResult.dayPrice,
    returnNightPrice: returnNightRateResult.nightPrice,
    returnNightSurcharge: returnNightRateResult.nightSurcharge,
    returnPriceWithNightRate: returnNightRateResult.totalWithNightRate
  };
};
