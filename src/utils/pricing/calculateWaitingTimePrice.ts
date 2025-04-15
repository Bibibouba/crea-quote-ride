
import { PricingSettings } from '@/types/quoteForm';
import { isNightTime } from './timeUtils';

/**
 * Calculates the price for waiting time based on the given parameters
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
