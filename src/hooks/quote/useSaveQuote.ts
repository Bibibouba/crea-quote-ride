import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuotes } from '@/hooks/useQuotes';
import { PricingSettings, Vehicle, QuoteDetailsType } from '@/types/quoteForm';
import { validateQuoteData } from './utils/validateQuoteData';
import { useClientManagement } from './useClientManagement';
import { useQuoteEmailSender } from './useQuoteEmailSender';
import { prepareQuoteData } from './utils/prepareQuoteData';
import { useSessionManager } from './useSessionManager';

interface UseSaveQuoteProps {
  quoteDetails: QuoteDetailsType | null | undefined;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
  date: Date;
  time: string;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  customReturnCoordinates: [number, number] | undefined;
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  estimatedDistance: number;
  estimatedDuration: number;
  selectedVehicle: string;
  vehicles: Vehicle[];
  pricingSettings: PricingSettings;
}

export const useSaveQuote = ({
  quoteDetails,
  departureAddress,
  destinationAddress,
  departureCoordinates,
  destinationCoordinates,
  date,
  time,
  hasReturnTrip,
  returnToSameAddress,
  customReturnAddress,
  customReturnCoordinates,
  returnDistance,
  returnDuration,
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  estimatedDistance,
  estimatedDuration,
  selectedVehicle,
  vehicles,
  pricingSettings
}: UseSaveQuoteProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const { addQuote } = useQuotes();
  const { toast } = useToast();
  const { createNewClient } = useClientManagement();
  const { sendQuoteEmail } = useQuoteEmailSender();
  const { getAuthenticatedUserId } = useSessionManager();
  
  const handleSaveQuote = async (firstName?: string, lastName?: string, email?: string, phone?: string, selectedClient?: string) => {
    const isValid = validateQuoteData({
      date,
      departureCoordinates,
      destinationCoordinates,
      hasReturnTrip,
      returnToSameAddress,
      customReturnAddress
    });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const driverId = await getAuthenticatedUserId();
      let finalClientId = selectedClient;
      
      if ((!selectedClient || selectedClient === '') && firstName && lastName) {
        finalClientId = await createNewClient(driverId, firstName, lastName, email, phone);
      }
      
      if (!finalClientId) {
        throw new Error("Aucun client spécifié pour ce devis");
      }
      
      const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
      if (!selectedVehicleInfo) {
        throw new Error("Véhicule non trouvé");
      }
      
      if (!quoteDetails) {
        throw new Error("Erreur lors du calcul du devis");
      }
      
      console.log("Creating quote for driver_id:", driverId);
      
      const quoteData = prepareQuoteData({
        driverId,
        clientId: finalClientId,
        selectedVehicle,
        departureAddress,
        destinationAddress,
        departureCoordinates,
        destinationCoordinates,
        dateTime,
        estimatedDistance,
        estimatedDuration,
        quoteDetails,
        hasReturnTrip,
        hasWaitingTime,
        waitingTimeMinutes,
        waitingTimePrice,
        returnToSameAddress,
        customReturnAddress,
        customReturnCoordinates,
        returnDistance,
        returnDuration
      });
      
      const savedQuote = await addQuote.mutateAsync(quoteData);
      console.log("Quote saved:", savedQuote);
      
      if (email) {
        try {
          await sendQuoteEmail({
            clientName: `${firstName} ${lastName}`,
            email,
            quote: savedQuote,
            departureAddress,
            destinationAddress
          });
          
          toast({
            title: 'Devis envoyé',
            description: 'Le devis a été enregistré et envoyé par email.',
          });
          setIsQuoteSent(true);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError);
          toast({
            title: 'Devis enregistré',
            description: 'Le devis a été enregistré mais l\'envoi par email a échoué.',
          });
          setIsQuoteSent(true);
        }
      } else {
        toast({
          title: 'Devis enregistré',
          description: 'Votre devis a été enregistré avec succès',
        });
        setIsQuoteSent(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
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
