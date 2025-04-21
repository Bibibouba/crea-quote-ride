
import { useState, useEffect } from 'react';
import { calculateDetailedWaitingPrice } from '@/utils/pricing/waiting-time/calculateDetailedWaitingPrice';
import { WaitingTimeCalculationResult } from '@/types/waitingTime';
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
  const [waitingTimeDetails, setWaitingTimeDetails] = useState<WaitingTimeCalculationResult | null>(null);
  
  useEffect(() => {
    if (!hasWaitingTime) {
      setWaitingTimeDetails(null);
      return;
    }
    
    // Calculer l'heure de début d'attente (après le trajet estimé)
    const [hours, minutes] = time.split(':').map(Number);
    const tripDuration = 60; // Durée estimée du trajet en minutes
    
    const waitStartDate = new Date(date);
    waitStartDate.setHours(hours, minutes + tripDuration, 0, 0);
    
    // Récupérer les paramètres du véhicule sélectionné
    const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
    
    // Calculer les détails du temps d'attente
    const details = calculateDetailedWaitingPrice(
      hasWaitingTime,
      waitingTimeMinutes,
      waitStartDate,
      pricingSettings,
      selectedVehicleInfo?.wait_night_enabled
    );
    
    setWaitingTimeDetails(details);
  }, [hasWaitingTime, waitingTimeMinutes, selectedVehicle, vehicles, pricingSettings, time, date]);

  return {
    waitingTimePrice: waitingTimeDetails?.totalWaitPriceTTC || 0,
    waitingTimeDetails
  };
};
