
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
  waitingTimeMinutes: number,
  waitingTimeEndTime?: Date | null
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
  
  let returnStartTime;
  
  // Utiliser l'heure de fin d'attente si disponible
  if (waitingTimeEndTime && hasWaitingTime) {
    returnStartTime = new Date(waitingTimeEndTime);
    console.log("Using waiting time end for return trip start:", returnStartTime.toLocaleTimeString());
  } else {
    // Méthode originale: calculer à partir de l'heure de départ + durée du trajet
    const arrivalTime = new Date(departureTime.getTime() + estimatedDurationMinutes * 60 * 1000);
    
    // Si pas d'heure de fin d'attente mais temps d'attente présent, calculer
    const waitingTimeMinutesValue = hasWaitingTime ? waitingTimeMinutes : 0;
    returnStartTime = new Date(arrivalTime.getTime() + (waitingTimeMinutesValue * 60 * 1000));
    
    console.log("Calculated return trip timing:", {
      departureTime: departureTime.toLocaleTimeString(),
      arrivalTime: arrivalTime.toLocaleTimeString(),
      returnStartTime: returnStartTime.toLocaleTimeString(),
      estimatedDurationMinutes,
      waitingTimeMinutes: waitingTimeMinutesValue
    });
  }

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
    returnStartTime: returnStartTime.toLocaleTimeString(),
    returnDayKm, 
    returnNightKm, 
    returnDayPercentage, 
    returnNightPercentage, 
    returnNightHours, 
    returnDayHours
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
