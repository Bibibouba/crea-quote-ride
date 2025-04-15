
import { useState, useEffect } from 'react';
import { calculateWaitingTimePrice } from '@/utils/pricing';
import { PricingSettings, Vehicle } from '@/types/quoteForm';

interface UseWaitingTimeCalculationProps {
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  selectedVehicle: string;
  vehicles: Vehicle[];
  pricingSettings: PricingSettings;
  time: string;
  date: Date;
}

export const useWaitingTimeCalculation = ({
  hasWaitingTime,
  waitingTimeMinutes,
  selectedVehicle,
  vehicles,
  pricingSettings,
  time,
  date,
}: UseWaitingTimeCalculationProps) => {
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  
  useEffect(() => {
    if (!hasWaitingTime) {
      setWaitingTimePrice(0);
      return;
    }
    
    const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
    const price = calculateWaitingTimePrice(
      hasWaitingTime,
      waitingTimeMinutes,
      pricingSettings,
      time,
      date,
      selectedVehicleInfo,
      selectedVehicleInfo?.wait_night_enabled || false
    );
    
    setWaitingTimePrice(price);
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time, date, vehicles, selectedVehicle]);
  
  // Generate waiting time options for dropdown
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
  
  return {
    waitingTimePrice,
    waitingTimeOptions
  };
};
