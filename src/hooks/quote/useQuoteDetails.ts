
import { useState, useEffect } from 'react';
import { calculateQuoteDetails } from '@/utils/pricing';
import { PricingSettings, Vehicle, QuoteDetails } from '@/types/quoteForm';

interface UseQuoteDetailsProps {
  selectedVehicle: string;
  estimatedDistance: number;
  returnDistance: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  vehicles: Vehicle[];
  hasWaitingTime: boolean;
  waitingTimePrice: number;
  time: string;
  date: Date;
  pricingSettings: PricingSettings;
}

export const useQuoteDetails = ({
  selectedVehicle,
  estimatedDistance,
  returnDistance,
  hasReturnTrip,
  returnToSameAddress,
  vehicles,
  hasWaitingTime,
  waitingTimePrice,
  time,
  date,
  pricingSettings
}: UseQuoteDetailsProps) => {
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);
  
  useEffect(() => {
    if (!selectedVehicle || estimatedDistance === 0 || vehicles.length === 0) {
      setQuoteDetails(null);
      return;
    }
    
    const calculatedQuote = calculateQuoteDetails(
      selectedVehicle,
      estimatedDistance,
      returnToSameAddress ? estimatedDistance : returnDistance,
      hasReturnTrip,
      returnToSameAddress,
      vehicles,
      hasWaitingTime,
      waitingTimePrice,
      time,
      date,
      pricingSettings
    );
    
    setQuoteDetails(calculatedQuote);
  }, [
    selectedVehicle,
    estimatedDistance,
    returnDistance,
    hasReturnTrip,
    returnToSameAddress,
    vehicles,
    hasWaitingTime,
    waitingTimePrice,
    time,
    date,
    pricingSettings
  ]);
  
  return { quoteDetails };
};
