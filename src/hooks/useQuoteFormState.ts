
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuotes } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { Quote } from '@/types/quote';
import { Vehicle } from '@/types/quoteForm';
import { usePricing } from '@/hooks/use-pricing';

export interface UseQuoteFormStateProps {
  clientId?: string;
  onSuccess?: () => void;
}

export const useQuoteFormState = ({ clientId, onSuccess }: UseQuoteFormStateProps) => {
  const { user } = useAuth();
  const { addQuote } = useQuotes();
  const { clients } = useClients();
  const { toast } = useToast();
  const { pricingSettings } = usePricing();
  const { getRoute } = useMapbox();
  
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState(clientId || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  
  const vehicles: Vehicle[] = [
    { id: "sedan", name: "Berline", basePrice: 1.8, capacity: 4, description: "Mercedes Classe E ou équivalent" },
    { id: "van", name: "Van", basePrice: 2.2, capacity: 6, description: "Mercedes Classe V ou équivalent" },
    { id: "luxury", name: "Luxe", basePrice: 2.5, capacity: 4, description: "Mercedes Classe S ou équivalent" }
  ];
  
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  const estimatedPrice = Math.round(estimatedDistance * basePrice);
  
  const waitingTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const minutes = (i + 1) * 15;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let label = "";
    if (hours > 0) {
      label += `${hours} heure${hours > 1 ? 's' : ''}`;
      if (remainingMinutes > 0) {
        label += ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else {
      label = `${minutes} minutes`;
    }
    
    return {
      value: minutes,
      label
    };
  });
  
  // Effect for return route calculation
  useEffect(() => {
    const calculateReturnRoute = async () => {
      if (!hasReturnTrip || returnToSameAddress || !customReturnCoordinates || !destinationCoordinates) {
        return;
      }
      
      try {
        const route = await getRoute(destinationCoordinates, customReturnCoordinates);
        if (route) {
          setReturnDistance(Math.round(route.distance));
          setReturnDuration(Math.round(route.duration));
        }
      } catch (error) {
        console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
      }
    };
    
    calculateReturnRoute();
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, getRoute]);
  
  // Effect for waiting time price calculation
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
    const pricePerMin = pricingSettings.waiting_fee_per_minute || 0.5;
    const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
    
    const quarters = Math.ceil(waitingTimeMinutes / 15);
    let price = quarters * pricePerQuarter;
    
    if (pricingSettings.wait_night_enabled && pricingSettings.wait_night_percentage && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.wait_night_start?.split(':').map(Number) || [0, 0];
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricingSettings.wait_night_end?.split(':').map(Number) || [0, 0];
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      const isNight = (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      );
      
      if (isNight) {
        const nightPercentage = pricingSettings.wait_night_percentage || 0;
        price += price * (nightPercentage / 100);
      }
    }
    
    setWaitingTimePrice(Math.round(price));
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time]);
  
  // Effect for loading client info
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client.id);
        setFirstName(client.first_name);
        setLastName(client.last_name);
        setEmail(client.email);
        setPhone(client.phone || '');
      }
    }
  }, [clientId, clients]);
  
  // Effect for loading user info
  useEffect(() => {
    if (user && !clientId) {
      const fetchUserInfo = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFirstName(data.first_name || '');
            setLastName(data.last_name || '');
            setEmail(data.email || user.email || '');
            setPhone('');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, [user, clientId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (departureCoordinates && destinationCoordinates) {
      setTimeout(() => {
        setShowQuote(true);
        setIsLoading(false);
      }, 500);
    } else {
      toast({
        title: 'Adresses incomplètes',
        description: 'Veuillez sélectionner des adresses valides pour le départ et la destination',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  };
  
  const handleSaveQuote = async () => {
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
      
      const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
      const oneWayPrice = estimatedDistance * basePrice;
      const returnPrice = hasReturnTrip 
        ? (returnToSameAddress ? estimatedDistance * basePrice : returnDistance * basePrice) 
        : 0;
      
      let totalPriceCalculated = oneWayPrice;
      if (hasWaitingTime) {
        totalPriceCalculated += waitingTimePrice;
      }
      if (hasReturnTrip) {
        totalPriceCalculated += returnPrice;
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
        amount: totalPriceCalculated,
        status: "pending",
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
      
      setIsQuoteSent(true);
      
      if (onSuccess) {
        onSuccess();
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

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };

  const handleReset = () => {
    setShowQuote(false);
    setIsQuoteSent(false);
  };

  return {
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    setDepartureCoordinates,
    destinationCoordinates,
    setDestinationCoordinates,
    date,
    setDate,
    time,
    setTime,
    selectedVehicle,
    setSelectedVehicle,
    passengers,
    setPassengers,
    showQuote,
    setShowQuote,
    isLoading,
    setIsLoading,
    isSubmitting,
    setIsSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    selectedClient,
    setSelectedClient,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    estimatedDistance,
    setEstimatedDistance,
    estimatedDuration,
    setEstimatedDuration,
    hasReturnTrip,
    setHasReturnTrip,
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    waitingTimePrice,
    setWaitingTimePrice,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    setCustomReturnCoordinates,
    returnDistance,
    setReturnDistance,
    returnDuration,
    setReturnDuration,
    vehicles,
    basePrice,
    estimatedPrice,
    waitingTimeOptions,
    handleSubmit,
    handleReturnAddressSelect,
    handleSaveQuote,
    handleRouteCalculated,
    handleReset
  };
};
