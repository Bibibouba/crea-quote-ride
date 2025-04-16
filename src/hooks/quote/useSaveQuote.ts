
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuotes } from '@/hooks/useQuotes';
import { Quote } from '@/types/quote';
import { PricingSettings, Vehicle, QuoteDetailsType } from '@/types/quoteForm';

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
  
  const handleSaveQuote = async (firstName?: string, lastName?: string, email?: string, phone?: string, selectedClient?: string) => {
    if (!date) {
      toast({
        title: 'Date manquante',
        description: 'Veuillez sélectionner une date pour le trajet',
        variant: 'destructive'
      });
      return;
    }
    
    if (!departureCoordinates || !destinationCoordinates) {
      toast({
        title: 'Adresses incomplètes',
        description: 'Veuillez sélectionner des adresses valides pour le calcul du trajet',
        variant: 'destructive'
      });
      return;
    }
    
    if (hasReturnTrip && !returnToSameAddress && !customReturnAddress) {
      toast({
        title: 'Adresse de retour manquante',
        description: 'Veuillez spécifier une adresse de retour',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const { data: { session } } = await supabase.auth.getSession();
      const driverId = session?.user?.id;
      
      if (!driverId) {
        throw new Error("Utilisateur non authentifié");
      }
      
      let finalClientId = selectedClient;
      
      if ((!selectedClient || selectedClient === '') && firstName && lastName) {
        console.log("Creating new client with driver_id:", driverId);
        
        const { data, error } = await supabase
          .from('clients')
          .insert({
            driver_id: driverId,
            first_name: firstName,
            last_name: lastName,
            email: email || '',
            phone: phone || '',
            client_type: 'personal'
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating client:", error);
          throw error;
        }
        
        console.log("Created new client:", data);
        finalClientId = data.id;
        
        toast({
          title: 'Client créé',
          description: `${firstName} ${lastName} a été ajouté à votre liste de clients`,
        });
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
      
      const quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf"> = {
        driver_id: driverId,
        client_id: finalClientId,
        vehicle_id: selectedVehicle,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration, 
        ride_date: dateTime.toISOString(),
        amount: quoteDetails.totalPrice,
        status: "pending",
        has_return_trip: hasReturnTrip,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: hasWaitingTime ? waitingTimeMinutes : 0,
        waiting_time_price: hasWaitingTime ? waitingTimePrice : 0,
        return_to_same_address: returnToSameAddress,
        custom_return_address: customReturnAddress,
        return_coordinates: customReturnCoordinates,
        return_distance_km: returnDistance,
        return_duration_minutes: returnDuration,
        day_km: quoteDetails.dayKm,
        night_km: quoteDetails.nightKm,
        total_km: quoteDetails.totalKm,
        day_price: quoteDetails.dayPrice,
        night_price: quoteDetails.nightPrice,
        night_surcharge: quoteDetails.nightSurcharge,
        has_night_rate: quoteDetails.isNightRate,
        night_hours: quoteDetails.nightHours,
        night_rate_percentage: quoteDetails.nightRatePercentage,
        is_sunday_holiday: quoteDetails.isSunday,
        sunday_holiday_percentage: quoteDetails.sundayRate,
        sunday_holiday_surcharge: quoteDetails.sundaySurcharge,
        wait_time_day: quoteDetails.waitTimeDay,
        wait_time_night: quoteDetails.waitTimeNight,
        wait_price_day: quoteDetails.waitPriceDay,
        wait_price_night: quoteDetails.waitPriceNight
      };
      
      await addQuote.mutateAsync(quoteData);
      
      toast({
        title: 'Devis enregistré',
        description: 'Votre devis a été enregistré avec succès',
      });
      
      setIsQuoteSent(true);
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
