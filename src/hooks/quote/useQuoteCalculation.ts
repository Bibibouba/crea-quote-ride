
import { useMemo } from 'react';
import { Vehicle } from '@/types/quoteForm';

interface UseQuoteCalculationProps {
  oneWayDistance: number;
  returnDistance: number;
  vehicles: Vehicle[];
  selectedVehicle: string;
}

export const useQuoteCalculation = ({
  oneWayDistance,
  returnDistance,
  vehicles,
  selectedVehicle
}: UseQuoteCalculationProps) => {
  // Calculate total distance
  const totalDistance = useMemo(() => {
    return oneWayDistance + returnDistance;
  }, [oneWayDistance, returnDistance]);
  
  // Calculate base price
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  
  // Calculate estimated price
  const estimatedPrice = useMemo(() => {
    return Math.round(totalDistance * basePrice);
  }, [totalDistance, basePrice]);
  
  return {
    totalDistance,
    basePrice,
    estimatedPrice
  };
};
