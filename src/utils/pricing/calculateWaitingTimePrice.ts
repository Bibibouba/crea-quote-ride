
import { PricingSettings } from '@/types/quoteForm';
import { isNightTime } from './timeUtils';

/**
 * Calcule le prix du temps d'attente en séparant jour et nuit
 */
export const calculateWaitingTimePrice = (
  hasWaitingTime: boolean, 
  waitingTimeMinutes: number, 
  pricingSettings: PricingSettings | null,
  time: string,
  selectedVehicle: any = null
): number => {
  if (!hasWaitingTime) return 0;
  
  const pricePerQuarter = selectedVehicle?.wait_price_per_15min || 
                        pricingSettings?.wait_price_per_15min || 7.5;
  
  const quarters = Math.ceil(waitingTimeMinutes / 15);
  let price = quarters * pricePerQuarter;
  
  const useVehicleWaitNight = selectedVehicle?.wait_night_enabled && 
                             selectedVehicle?.wait_night_start && 
                             selectedVehicle?.wait_night_end && 
                             selectedVehicle?.wait_night_percentage;
  
  if ((useVehicleWaitNight || (pricingSettings?.wait_night_enabled && pricingSettings?.wait_night_percentage)) && time) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date();
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date();
    const startTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_start : pricingSettings?.wait_night_start;
    const [startHours, startMinutes] = startTimeStr?.split(':').map(Number) || [0, 0];
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date();
    const endTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_end : pricingSettings?.wait_night_end;
    const [endHours, endMinutes] = endTimeStr?.split(':').map(Number) || [0, 0];
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    const isNight = (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
    
    if (isNight) {
      const nightPercentage = useVehicleWaitNight ? 
                            selectedVehicle.wait_night_percentage : 
                            pricingSettings?.wait_night_percentage || 0;
      price += price * (nightPercentage / 100);
    }
  }
  
  return Math.round(price);
};

/**
 * Calcul détaillé du temps d'attente avec séparation jour/nuit
 */
export const calculateDetailedWaitingPrice = (
  hasWaitingTime: boolean, 
  waitingTimeMinutes: number, 
  pricingSettings: PricingSettings | null,
  time: string,
  date: Date,
  selectedVehicle: any = null
) => {
  if (!hasWaitingTime || waitingTimeMinutes <= 0) {
    return {
      waitTimeDay: 0,
      waitTimeNight: 0,
      waitPriceDay: 0,
      waitPriceNight: 0,
      totalWaitPrice: 0
    };
  }
  
  const pricePerQuarter = selectedVehicle?.wait_price_per_15min || 
                         pricingSettings?.wait_price_per_15min || 7.5;
  
  const useVehicleWaitNight = selectedVehicle?.wait_night_enabled && 
                              selectedVehicle?.wait_night_start && 
                              selectedVehicle?.wait_night_end && 
                              selectedVehicle?.wait_night_percentage;
  
  // Récupérer les paramètres de nuit
  const nightStartStr = useVehicleWaitNight ? 
                       selectedVehicle.wait_night_start : 
                       pricingSettings?.wait_night_start || "20:00";
  
  const nightEndStr = useVehicleWaitNight ? 
                     selectedVehicle.wait_night_end : 
                     pricingSettings?.wait_night_end || "06:00";
  
  const nightPercentage = useVehicleWaitNight ? 
                         selectedVehicle.wait_night_percentage : 
                         pricingSettings?.wait_night_percentage || 15;
  
  // Calculer la durée d'attente pendant la nuit
  const tripStartTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  tripStartTime.setHours(hours, minutes, 0, 0);
  
  // On considère que l'attente commence après l'arrivée estimée
  // (qui est l'heure de départ + durée du trajet, mais ici on utilise simplement l'heure de départ)
  const waitStartTime = new Date(tripStartTime);
  
  // Créer les limites de période de nuit
  const nightStart = new Date(date);
  const [nightStartHours, nightStartMinutes] = nightStartStr.split(':').map(Number);
  nightStart.setHours(nightStartHours, nightStartMinutes, 0, 0);
  
  const nightEnd = new Date(date);
  const [nightEndHours, nightEndMinutes] = nightEndStr.split(':').map(Number);
  nightEnd.setHours(nightEndHours, nightEndMinutes, 0, 0);
  
  // Si la fin de nuit est avant le début, cela signifie qu'elle est le jour suivant
  if (nightEnd <= nightStart) {
    nightEnd.setDate(nightEnd.getDate() + 1);
  }
  
  // Calculer combien du temps d'attente tombe pendant la nuit
  let nightMinutes = 0;
  const waitEndTime = new Date(waitStartTime.getTime() + waitingTimeMinutes * 60 * 1000);
  
  // Cas 1: L'attente commence avant la période de nuit et finit après le début de la nuit
  if (waitStartTime < nightStart && waitEndTime > nightStart) {
    const nightPortionEnd = waitEndTime < nightEnd ? waitEndTime : nightEnd;
    nightMinutes += (nightPortionEnd.getTime() - nightStart.getTime()) / (60 * 1000);
  }
  
  // Cas 2: L'attente commence pendant la période de nuit
  if (waitStartTime >= nightStart && waitStartTime < nightEnd) {
    const nightPortionEnd = waitEndTime < nightEnd ? waitEndTime : nightEnd;
    nightMinutes += (nightPortionEnd.getTime() - waitStartTime.getTime()) / (60 * 1000);
  }
  
  // Cas 3: L'attente chevauche minuit et le lendemain matin
  if (nightEnd < nightStart && waitEndTime > nightEnd) {
    // Si l'attente commence après minuit mais avant la fin de la nuit
    if (waitStartTime < nightEnd) {
      nightMinutes += (nightEnd.getTime() - waitStartTime.getTime()) / (60 * 1000);
    }
    
    // La portion après minuit jusqu'à nightEnd 
    const nextNightStart = new Date(nightStart);
    nextNightStart.setDate(nextNightStart.getDate() + 1);
    
    if (waitEndTime > nextNightStart) {
      const nextNightEnd = new Date(nightEnd);
      nextNightEnd.setDate(nextNightEnd.getDate() + 1);
      const endNightPortion = waitEndTime < nextNightEnd ? waitEndTime : nextNightEnd;
      nightMinutes += (endNightPortion.getTime() - nextNightStart.getTime()) / (60 * 1000);
    }
  }
  
  // S'assurer que les valeurs sont positives
  nightMinutes = Math.max(0, Math.round(nightMinutes));
  const dayMinutes = Math.max(0, waitingTimeMinutes - nightMinutes);
  
  // Calculer le prix de l'attente jour et nuit
  const dayQuarters = Math.ceil(dayMinutes / 15);
  const nightQuarters = Math.ceil(nightMinutes / 15);
  
  const waitPriceDay = dayQuarters * pricePerQuarter;
  const waitPriceNight = nightQuarters * pricePerQuarter * (1 + nightPercentage / 100);
  
  const totalWaitPrice = waitPriceDay + waitPriceNight;
  
  return {
    waitTimeDay: dayMinutes,
    waitTimeNight: nightMinutes,
    waitPriceDay: Math.round(waitPriceDay * 100) / 100,
    waitPriceNight: Math.round(waitPriceNight * 100) / 100,
    totalWaitPrice: Math.round(totalWaitPrice * 100) / 100
  };
};
