
import { useState, useEffect } from 'react';
import { usePricing } from '@/hooks/use-pricing';

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export function useQuoteWaitingTime(time: string) {
  const { pricingSettings } = usePricing();
  
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);

  // Create waiting time options
  const waitingTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const minutes = (i + 1) * 15;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let label = "";
    if (hours > 0) {
      label += `${hours} heure${hours > 1 ? 's' : ''}`;
      if (remainingMinutes > 0) {
        label += ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else {
      label = `${minutes} minutes`;
    }
    
    return {
      value: minutes,
      label
    };
  });

  // Calculate waiting time price
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
    const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
    
    const quarters = Math.ceil(waitingTimeMinutes / 15);
    let price = quarters * pricePerQuarter;
    
    if (pricingSettings.wait_night_enabled && pricingSettings.wait_night_percentage && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.wait_night_start?.split(':').map(Number) || [0, 0];
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      const isNight = (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      );
      
      if (isNight) {
        const nightPercentage = pricingSettings.wait_night_percentage || 0;
        price += price * (nightPercentage / 100);
      }
    }
    
    setWaitingTimePrice(Math.round(price));
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time]);

  return {
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    waitingTimePrice,
    waitingTimeOptions
  };
}
