
import { useSaveQuote } from '../useSaveQuote';
import { QuoteDetailsType } from '@/types/quoteForm';
import { useClientData } from '../useClientData';

interface UseQuoteSubmissionProps {
  quoteDetails: QuoteDetailsType | null;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number]; 
  destinationCoordinates: [number, number]; 
  date: Date;
  time: string;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  customReturnCoordinates: [number, number];
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  estimatedDistance: number;
  estimatedDuration: number;
  selectedVehicle: string;
  vehicles: any[];
  pricingSettings: any;
  onSuccess?: () => void;
}

export const useQuoteSubmission = (props: UseQuoteSubmissionProps) => {
  const clientData = useClientData();
  
  const {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote: saveQuote
  } = useSaveQuote(props);

  const handleSaveQuote = async () => {
    await saveQuote(
      clientData.firstName,
      clientData.lastName,
      clientData.email,
      clientData.phone,
      clientData.selectedClient
    );

    if (props.onSuccess) {
      props.onSuccess();
    }
  };

  return {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote,
    ...clientData
  };
};
