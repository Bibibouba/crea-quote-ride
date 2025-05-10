
import { useState } from 'react';
import { useSessionManager } from './useSessionManager';
import { validateQuoteData } from './utils/validateQuoteData';
import { useClientCreator } from './submission/useClientCreator';
import { useQuoteCreator } from './submission/useQuoteCreator';
import { useQuoteSender } from './submission/useQuoteSender';
import { QuoteDetailsType } from '@/types/quoteForm';

interface UseSaveQuoteProps {
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
}

export const useSaveQuote = (props: UseSaveQuoteProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const { getAuthenticatedUserId } = useSessionManager();
  const { ensureClientExists } = useClientCreator();
  const { createQuote } = useQuoteCreator();
  const { sendQuote } = useQuoteSender();
  
  const handleSaveQuote = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    selectedClient?: string
  ) => {
    const isValid = validateQuoteData({
      clientId: selectedClient,
      driverId: 'temp', // Sera remplacé par getAuthenticatedUserId
      quoteDetails: props.quoteDetails,
      selectedVehicle: props.selectedVehicle,
      departureAddress: props.departureAddress,
      destinationAddress: props.destinationAddress,
      departureCoordinates: props.departureCoordinates,
      destinationCoordinates: props.destinationCoordinates,
      hasReturnTrip: props.hasReturnTrip,
      returnToSameAddress: props.returnToSameAddress,
      customReturnAddress: props.customReturnAddress
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const dateTime = new Date(props.date);
      const [hours, minutes] = props.time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const driverId = await getAuthenticatedUserId();
      
      const clientId = await ensureClientExists({
        driverId,
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phone,
        selectedClient
      });

      const savedQuote = await createQuote({
        driverId,
        clientId,
        selectedVehicle: props.selectedVehicle,
        departureAddress: props.departureAddress,
        destinationAddress: props.destinationAddress,
        departureCoordinates: props.departureCoordinates,
        destinationCoordinates: props.destinationCoordinates,
        dateTime,
        estimatedDistance: props.estimatedDistance,
        estimatedDuration: props.estimatedDuration,
        quoteDetails: props.quoteDetails,
        hasReturnTrip: props.hasReturnTrip,
        hasWaitingTime: props.hasWaitingTime,
        waitingTimeMinutes: props.waitingTimeMinutes,
        waitingTimePrice: props.waitingTimePrice,
        returnToSameAddress: props.returnToSameAddress,
        customReturnAddress: props.customReturnAddress,
        customReturnCoordinates: props.customReturnCoordinates,
        returnDistance: props.returnDistance,
        returnDuration: props.returnDuration
      });

      if (email) {
        await sendQuote({
          email,
          firstName,
          lastName,
          quote: savedQuote,
          departureAddress: props.departureAddress,
          destinationAddress: props.destinationAddress
        });
      }
      
      setIsQuoteSent(true);
      
    } catch (error) {
      console.error('Error saving quote:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote
  };
};
