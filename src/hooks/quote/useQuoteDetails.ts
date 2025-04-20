
import { useState, useEffect } from 'react';
import { calculateQuoteDetails } from '@/utils/pricing';
import { PricingSettings, Vehicle, QuoteDetailsType } from '@/types/quoteForm';

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
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetailsType | null>(null);
  
  useEffect(() => {
    if (!selectedVehicle || estimatedDistance === 0 || vehicles.length === 0) {
      setQuoteDetails(null);
      return;
    }
    
    // Ensure we have a valid date
    const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
    
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
      validDate,
      pricingSettings
    );
    
    // Create QuoteDetailsType from the calculated quote
    const quoteDetailsType: QuoteDetailsType = {
      estimatedDistance,
      estimatedDuration: 0, // This would be set elsewhere
      amount: calculatedQuote.totalPrice,
      departureAddress: '', // This would be set elsewhere
      destinationAddress: '', // This would be set elsewhere
      departureCoordinates: [0, 0], // This would be set elsewhere
      destinationCoordinates: [0, 0], // This would be set elsewhere
      time,
      date: validDate,
      // Copy all properties from calculatedQuote
      ...calculatedQuote
    };
    
    setQuoteDetails(quoteDetailsType);
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
