
import { useState, useEffect } from 'react';
import { calculateQuoteDetails } from '@/utils/pricing';
import { PricingSettings, Vehicle } from '@/types/quoteForm';

// Define interface for QuoteDetails
export interface QuoteDetails {
  basePrice: number;
  isNightRate: boolean;
  nightRatePercentage: number;
  nightHours: number;
  dayHours: number;
  nightMinutes: number;
  totalMinutes: number;
  nightStartDisplay: string;
  nightEndDisplay: string;
  dayKm: number;
  nightKm: number;
  totalKm: number;
  dayPrice: number;
  nightPrice: number;
  isSunday: boolean;
  sundayRate: number;
  oneWayPriceHT: number;
  returnPriceHT: number;
  waitingTimePriceHT: number;
  totalPriceHT: number;
  totalVAT: number;
  oneWayPrice: number;
  returnPrice: number;
  waitingTimePrice: number;
  totalPrice: number;
  nightSurcharge: number;
  sundaySurcharge: number;
  rideVatRate: number;
  waitingVatRate: number;
  hasMinDistanceWarning: boolean;
  minDistance: number;
  waitTimeDay: number;
  waitTimeNight: number;
  waitPriceDay: number;
  waitPriceNight: number;
}

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
    
    setQuoteDetails(calculatedQuote as QuoteDetails);
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
