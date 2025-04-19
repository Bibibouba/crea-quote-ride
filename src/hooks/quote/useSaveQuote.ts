import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuotes } from '@/hooks/useQuotes';
import { PricingSettings, Vehicle, QuoteDetailsType } from '@/types/quoteForm';
import { validateQuoteData } from './utils/validateQuoteData';
import { useClientManagement } from './useClientManagement';
import { useQuoteEmailSender } from './useQuoteEmailSender';
import { prepareQuoteData } from './utils/prepareQuoteData';
import { useSessionManager } from './useSessionManager';
import { quoteService } from '@/services/quote/quoteService';

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
      
      const quoteData = {
        ...prepareQuoteData({
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
        }),
        return_night_hours: quoteDetails.returnNightHours || 0,
        return_day_hours: quoteDetails.returnDayHours || 0,
        return_day_km: quoteDetails.returnDayKm || 0,
        return_night_km: quoteDetails.returnNightKm || 0,
        return_day_price: quoteDetails.returnDayPrice || 0,
        return_night_price: quoteDetails.returnNightPrice || 0,
        return_night_surcharge: quoteDetails.returnNightSurcharge || 0,
        is_return_night_rate: quoteDetails.isReturnNightRate || false,
        day_percentage: quoteDetails.dayPercentage || 0,
        night_percentage: quoteDetails.nightPercentage || 0,
        return_day_percentage: quoteDetails.returnDayPercentage || 0,
        return_night_percentage: quoteDetails.returnNightPercentage || 0
      };
      
      const savedQuote = await quoteService.createQuote({
        driverId,
        clientId: finalClientId,
        quoteData
      });
      
      console.log("📝 Devis enregistré avec succès:", savedQuote);
      
      if (email) {
        console.log("📧 Client a fourni une adresse email, tentative d'envoi:", email);
        
        try {
          // Préparation du nom complet du client
          let fullName = '';
          if (firstName && lastName) {
            fullName = `${firstName} ${lastName}`.trim();
          } else if (firstName) {
            fullName = firstName.trim();
          } else if (lastName) {
            fullName = lastName.trim();
          } else {
            fullName = "Client"; // Valeur par défaut si aucun nom n'est fourni
          }
          
          console.log("📧 Préparation de l'envoi d'email à", fullName, "sur", email);
          
          await sendQuoteEmail({
            clientName: fullName,
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
          console.error('📧 ❌ Erreur lors de l\'envoi de l\'email:', emailError);
          toast({
            title: 'Devis enregistré',
            description: 'Le devis a été enregistré mais l\'envoi par email a échoué.',
            variant: 'destructive',
          });
          setIsQuoteSent(true);
        }
      } else {
        console.log("📧 Pas d'email fourni, le devis est enregistré sans envoi d'email");
        toast({
          title: 'Devis enregistré',
          description: 'Votre devis a été enregistré avec succès',
        });
        setIsQuoteSent(true);
      }
    } catch (error) {
      console.error('📝 ❌ Erreur lors de l\'enregistrement du devis:', error);
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
