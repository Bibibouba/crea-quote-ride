
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
  
  // Vérifier si le temps d'attente est en période de nuit
  let isNightWaiting = false;
  let nightPercentage = 0;
  
  if ((useVehicleWaitNight || (pricingSettings?.wait_night_enabled && pricingSettings?.wait_night_percentage)) && time) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date(date);
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date(date);
    const startTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_start : pricingSettings?.wait_night_start;
    const [startHours, startMinutes] = startTimeStr?.split(':').map(Number) || [0, 0];
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date(date);
    const endTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_end : pricingSettings?.wait_night_end;
    const [endHours, endMinutes] = endTimeStr?.split(':').map(Number) || [0, 0];
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    // Ajuster la date de fin si elle est avant le début (nuit qui passe minuit)
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    isNightWaiting = (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
    
    nightPercentage = useVehicleWaitNight ? 
                    selectedVehicle.wait_night_percentage : 
                    pricingSettings?.wait_night_percentage || 0;
  }
  
  // Par simplicité, nous considérons que tout le temps d'attente est soit de jour, soit de nuit
  // Une implémentation plus précise pourrait découper l'attente en plusieurs périodes
  const waitTimeDay = isNightWaiting ? 0 : waitingTimeMinutes;
  const waitTimeNight = isNightWaiting ? waitingTimeMinutes : 0;
  
  const quarters = Math.ceil(waitingTimeMinutes / 15);
  const basePrice = quarters * pricePerQuarter;
  
  let waitPriceDay = 0;
  let waitPriceNight = 0;
  
  if (isNightWaiting) {
    waitPriceNight = basePrice * (1 + nightPercentage / 100);
  } else {
    waitPriceDay = basePrice;
  }
  
  return {
    waitTimeDay,
    waitTimeNight,
    waitPriceDay: Math.round(waitPriceDay * 100) / 100,
    waitPriceNight: Math.round(waitPriceNight * 100) / 100,
    totalWaitPrice: Math.round((waitPriceDay + waitPriceNight) * 100) / 100
  };
};
