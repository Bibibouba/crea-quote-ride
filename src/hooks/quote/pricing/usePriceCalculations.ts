
import { useQuoteDetails } from '../useQuoteDetails';
import { useWaitingTimeCalculation } from '../useWaitingTimeCalculation';
import { Vehicle, PricingSettings } from '@/types/quoteForm';

interface UsePriceCalculationsProps {
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  selectedVehicle: string;
  vehicles: Vehicle[];
  pricingSettings: PricingSettings;
  time: string;
  date: Date;
  estimatedDistance: number;
  returnDistance: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
}

export const usePriceCalculations = ({
  hasWaitingTime,
  waitingTimeMinutes,
  selectedVehicle,
  vehicles,
  pricingSettings,
  time,
  date,
  estimatedDistance,
  returnDistance,
  hasReturnTrip,
  returnToSameAddress
}: UsePriceCalculationsProps) => {
  // Calculate waiting time price
  const { waitingTimePrice } = useWaitingTimeCalculation({
    hasWaitingTime,
    waitingTimeMinutes,
    selectedVehicle,
    vehicles,
    pricingSettings,
    time,
    date
  });

  // Calculate quote details
  const { quoteDetails } = useQuoteDetails({
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
  });

  return {
    waitingTimePrice,
    quoteDetails
  };
};
