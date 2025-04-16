
import { QuoteFormStateProps } from '@/types/quoteForm';

interface UseFormResetProps {
  setDepartureAddress: (value: string) => void;
  setDestinationAddress: (value: string) => void;
  setDepartureCoordinates: (value: [number, number] | undefined) => void;
  setDestinationCoordinates: (value: [number, number] | undefined) => void;
  setCustomReturnAddress: (value: string) => void;
  setCustomReturnCoordinates: (value: [number, number] | undefined) => void;
  setDate: (value: Date) => void;
  setTime: (value: string) => void;
  setPassengers: (value: string) => void;
  setEstimatedDistance: (value: number) => void;
  setEstimatedDuration: (value: number) => void;
  setHasReturnTrip: (value: boolean) => void;
  setHasWaitingTime: (value: boolean) => void;
  setWaitingTimeMinutes: (value: number) => void;
  setReturnToSameAddress: (value: boolean) => void;
  setShowQuote: (value: boolean) => void;
  setIsQuoteSent: (value: boolean) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setSelectedVehicle: (value: string) => void;
  vehicles: any[];
}

export const useFormReset = ({
  setDepartureAddress,
  setDestinationAddress,
  setDepartureCoordinates,
  setDestinationCoordinates,
  setCustomReturnAddress,
  setCustomReturnCoordinates,
  setDate,
  setTime,
  setPassengers,
  setEstimatedDistance,
  setEstimatedDuration,
  setHasReturnTrip,
  setHasWaitingTime,
  setWaitingTimeMinutes,
  setReturnToSameAddress,
  setShowQuote,
  setIsQuoteSent,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setSelectedVehicle,
  vehicles
}: UseFormResetProps) => {
  const resetForm = () => {
    // Reset address form
    setDepartureAddress('');
    setDestinationAddress('');
    setDepartureCoordinates(undefined);
    setDestinationCoordinates(undefined);
    setCustomReturnAddress('');
    setCustomReturnCoordinates(undefined);
    
    // Reset trip options
    setDate(new Date());
    setTime('12:00');
    setPassengers('1');
    setEstimatedDistance(0);
    setEstimatedDuration(0);
    setHasReturnTrip(false);
    setHasWaitingTime(false);
    setWaitingTimeMinutes(15);
    setReturnToSameAddress(true);
    
    // Reset form state
    setShowQuote(false);
    setIsQuoteSent(false);
    
    // Reset client data
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    
    // Reset vehicle selection
    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  };
  
  return {
    resetForm
  };
};
