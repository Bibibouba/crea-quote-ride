
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { supabase } from '@/integrations/supabase/client';

export function useQuoteSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const { addQuote } = useQuotes();
  
  const submitQuote = async (quoteData: {
    firstName: string;
    lastName: string;
    email: string;
    departureAddress: string;
    destinationAddress: string;
    departureCoordinates?: [number, number];
    destinationCoordinates?: [number, number];
    date?: Date;
    time: string;
    selectedVehicle: string;
    estimatedDistance: number;
    estimatedDuration: number;
    price: number;
    hasReturnTrip: boolean;
    hasWaitingTime: boolean;
    waitingTimeMinutes: number;
    waitingTimePrice: number;
    returnToSameAddress: boolean;
    customReturnAddress: string;
    customReturnCoordinates?: [number, number];
    returnDistance: number;
    returnDuration: number;
  }) => {
    const {
      firstName, lastName, email,
      departureAddress, destinationAddress,
      departureCoordinates, destinationCoordinates,
      date, time, selectedVehicle,
      estimatedDistance, estimatedDuration, price,
      hasReturnTrip, hasWaitingTime, waitingTimeMinutes, waitingTimePrice,
      returnToSameAddress, customReturnAddress, customReturnCoordinates,
      returnDistance, returnDuration
    } = quoteData;
    
    if (!firstName || !lastName || !email) {
      toast.error('Veuillez remplir tous les champs requis');
      return false;
    }
    
    if (!departureCoordinates || !destinationCoordinates) {
      toast.error('Veuillez sélectionner des adresses valides pour le calcul du trajet');
      return false;
    }
    
    if (hasReturnTrip && !returnToSameAddress && !customReturnAddress) {
      toast.error('Veuillez spécifier une adresse de retour');
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error("Utilisateur non authentifié");
      }
      
      let clientId;
      const { data: existingClients, error: clientsError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .eq('driver_id', userId)
        .limit(1);
      
      if (clientsError) throw clientsError;
      
      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
      } else {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            driver_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            client_type: 'personal'
          })
          .select()
          .single();
        
        if (createError) throw createError;
        clientId = newClient.id;
      }
      
      const dateTime = new Date(date!);
      const [hours, minutes] = time.split(':').map(Number);
      dateTime.setHours(hours, minutes);
      
      const quoteData: Omit<QuoteWithCoordinates, 'id' | 'created_at' | 'updated_at' | 'quote_pdf'> = {
        client_id: clientId,
        vehicle_id: selectedVehicle || null,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration,
        ride_date: dateTime.toISOString(),
        amount: price,
        status: 'pending',
        driver_id: userId,
        has_return_trip: hasReturnTrip,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: hasWaitingTime ? waitingTimeMinutes : 0,
        waiting_time_price: hasWaitingTime ? waitingTimePrice : 0,
        return_to_same_address: returnToSameAddress,
        custom_return_address: customReturnAddress,
        return_coordinates: customReturnCoordinates,
        return_distance_km: returnDistance,
        return_duration_minutes: returnDuration
      };
      
      console.log("Submitting quote data:", quoteData);
      await addQuote.mutateAsync(quoteData);
      
      toast.success('Votre devis a été enregistré avec succès');
      setIsSubmitting(false);
      setIsQuoteSent(true);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsSubmitting(false);
      return false;
    }
  };
  
  const resetSubmissionState = () => {
    setIsQuoteSent(false);
  };
  
  return {
    isSubmitting,
    isQuoteSent,
    submitQuote,
    resetSubmissionState
  };
}
