
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuotes } from '@/hooks/useQuotes';
import { PricingSettings, Vehicle, QuoteDetailsType } from '@/types/quoteForm';
import { validateQuoteFields } from '@/services/quote/validation/validateQuoteFields';
import { prepareQuoteData } from './utils/prepareQuoteData';
import { useQuoteClientHandler } from './useQuoteClientHandler';
import { useQuoteEmailHandler } from './useQuoteEmailHandler';
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
  const { toast } = useToast();
  const { addQuote } = useQuotes();
  const { handleClientCreation } = useQuoteClientHandler();
  const { handleEmailSending } = useQuoteEmailHandler();
  
  const handleSaveQuote = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    selectedClient?: string
  ) => {
    const isValid = validateQuoteFields({
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
      
      // Handle client creation and get IDs
      const { driverId, clientId } = await handleClientCreation(
        firstName,
        lastName,
        email,
        phone,
        selectedClient
      );
      
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
          clientId,
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
        clientId,
        quoteData
      });
      
      console.log("📝 Devis enregistré avec succès:", savedQuote);
      
      // Handle email sending
      await handleEmailSending(
        email,
        firstName,
        lastName,
        savedQuote,
        departureAddress,
        destinationAddress
      );
      
      setIsQuoteSent(true);
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
