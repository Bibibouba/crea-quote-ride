
import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { usePricing } from '@/hooks/use-pricing';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuoteAddresses } from '@/hooks/useQuoteAddresses';
import { useQuoteWaitingTime, WaitingTimeOption } from '@/hooks/useQuoteWaitingTime';
import { useQuoteClient } from '@/hooks/useQuoteClient';
import { useQuotePricing } from '@/hooks/useQuotePricing';

// Re-export the WaitingTimeOption type so components can import it from useQuoteForm
export type { WaitingTimeOption };

export type QuoteFormStep = 'step1' | 'step2' | 'step3';

export function useQuoteForm(clientId?: string) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading: vehiclesLoading } = useVehicles();
  const { addQuote } = useQuotes();
  const { toast } = useToast();
  const { loading: pricingLoading } = usePricing();
  
  const [activeTab, setActiveTab] = useState<QuoteFormStep>('step1');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  
  // Integrate the sub-hooks
  const {
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    destinationCoordinates,
    estimatedDistance,
    estimatedDuration,
    hasReturnTrip,
    setHasReturnTrip,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    returnDistance,
    returnDuration,
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    calculateReturnRoute
  } = useQuoteAddresses();
  
  const {
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    waitingTimePrice,
    waitingTimeOptions
  } = useQuoteWaitingTime(time);
  
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail
  } = useQuoteClient(clientId);
  
  const {
    selectedVehicle,
    setSelectedVehicle,
    passengers,
    setPassengers,
    calculatedPrice,
    setCalculatedPrice,
    quoteDetails,
    setQuoteDetails,
    vehicles
  } = useQuotePricing();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
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
      
      let finalClientId = clientId;
      
      if (!clientId && firstName && lastName && email) {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          throw new Error("Utilisateur non authentifié");
        }
        
        const { data, error } = await supabase
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
        
        if (error) throw error;
        finalClientId = data.id;
      }
      
      if (!finalClientId) {
        throw new Error("Aucun client spécifié pour ce devis");
      }
      
      const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
      const basePrice = selectedVehicleData?.basePrice || 1.8;
      
      const oneWayPrice = Math.round(estimatedDistance * basePrice);
      const returnPrice = hasReturnTrip 
        ? (returnToSameAddress ? oneWayPrice : Math.round(returnDistance * basePrice)) 
        : 0;
      const totalPrice = oneWayPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
      
      setCalculatedPrice(totalPrice);
      setQuoteDetails({
        oneWayPrice,
        returnPrice,
        waitingTimePrice: hasWaitingTime ? waitingTimePrice : 0,
        totalPrice
      });
      
      const quoteData: Omit<QuoteWithCoordinates, 'id' | 'created_at' | 'updated_at' | 'quote_pdf'> = {
        client_id: finalClientId,
        vehicle_id: null,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration, 
        ride_date: dateTime.toISOString(),
        amount: totalPrice,
        status: 'pending',
        driver_id: '',
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
      
      await addQuote.mutateAsync(quoteData);
      
      toast({
        title: 'Devis enregistré',
        description: 'Votre devis a été enregistré avec succès',
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDepartureAddress('');
    setDestinationAddress('');
    setDate(new Date());
    setTime('09:00');
    setSelectedVehicle('');
    setPassengers('1');
    setHasReturnTrip(false);
    setHasWaitingTime(false);
    setWaitingTimeMinutes(15);
    setReturnToSameAddress(true);
    setCustomReturnAddress('');
  };
  
  const handleNextStep = () => {
    if (activeTab === 'step1') setActiveTab('step2');
    else if (activeTab === 'step2') setActiveTab('step3');
  };
  
  const handlePreviousStep = () => {
    if (activeTab === 'step3') setActiveTab('step2');
    else if (activeTab === 'step2') setActiveTab('step1');
  };
  
  return {
    activeTab,
    setActiveTab,
    
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    destinationCoordinates,
    date,
    setDate,
    time,
    setTime,
    selectedVehicle,
    setSelectedVehicle,
    passengers,
    setPassengers,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    estimatedDistance,
    estimatedDuration,
    isSubmitting,
    
    price: calculatedPrice,
    quoteDetails,
    isQuoteSent,
    
    hasReturnTrip,
    setHasReturnTrip,
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    waitingTimePrice,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    returnDistance,
    returnDuration,
    waitingTimeOptions,
    
    vehiclesLoading,
    pricingLoading,
    vehicles,
    
    handleNextStep,
    handlePreviousStep,
    
    handleSubmit,
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    resetForm,
    navigate
  };
}
