
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { usePricing } from '@/hooks/use-pricing';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';

export type QuoteFormStep = 'step1' | 'step2' | 'step3';

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export function useQuoteForm(clientId?: string) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { vehicleTypes } = useVehicleTypes();
  const { clients } = useClients();
  const { addQuote } = useQuotes();
  const { getRoute } = useMapbox();
  const { 
    pricingSettings, 
    loading: pricingLoading,
    distanceTiers
  } = usePricing();
  
  const [activeTab, setActiveTab] = useState<QuoteFormStep>('step1');
  
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  // Charger les types de véhicules disponibles depuis Supabase
  useEffect(() => {
    const loadVehiclesFromTypes = async () => {
      try {
        setVehiclesLoading(true);
        if (vehicleTypes.length > 0) {
          // Créer une liste de véhicules basée sur les types disponibles
          const vehiclesList = vehicleTypes.map(type => ({
            id: type.id,
            name: type.name,
            basePrice: 1.8, // prix par défaut, peut être modifié
            description: `Type de véhicule avec chauffeur`,
            capacity: 4, // capacité par défaut, peut être modifiée
            icon: type.icon
          }));
          
          setVehicles(vehiclesList);
          
          // Si aucun véhicule n'est sélectionné et qu'il y a des véhicules disponibles
          if (!selectedVehicle && vehiclesList.length > 0) {
            setSelectedVehicle(vehiclesList[0].id);
          }
        } else {
          // Véhicules par défaut si aucun type n'est disponible
          setVehicles([
            { id: "sedan", name: "Berline", basePrice: 1.8, description: "Mercedes Classe E ou équivalent", capacity: 4 },
            { id: "van", name: "Van", basePrice: 2.2, description: "Mercedes Classe V ou équivalent", capacity: 7 },
            { id: "luxury", name: "Luxe", basePrice: 2.5, description: "Mercedes Classe S ou équivalent", capacity: 3 }
          ]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les types de véhicules",
          variant: "destructive"
        });
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehiclesFromTypes();
  }, [vehicleTypes, toast, selectedVehicle]);
  
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setFirstName(client.first_name);
        setLastName(client.last_name);
        setEmail(client.email);
      }
    }
  }, [clientId, clients]);
  
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
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, [user, clientId]);
  
  // Calculer le prix du temps d'attente
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
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
      const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
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
  
  // Calculer l'itinéraire de retour
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
  
  // Calculer le prix du trajet
  useEffect(() => {
    if (!estimatedDistance || !selectedVehicle) return;
    
    const calculatePrice = () => {
      const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
      if (!selectedVehicleData) return;
      
      const basePrice = selectedVehicleData.basePrice || 1.8;
      
      const oneWayPrice = Math.round(estimatedDistance * basePrice);
      const returnPrice = hasReturnTrip 
        ? (returnToSameAddress ? oneWayPrice : Math.round(returnDistance * basePrice)) 
        : 0;
      const waitingTimeCost = hasWaitingTime ? waitingTimePrice : 0;
      const totalPrice = oneWayPrice + waitingTimeCost + returnPrice;
      
      setCalculatedPrice(totalPrice);
      setQuoteDetails({
        oneWayPrice,
        returnPrice,
        waitingTimePrice: waitingTimeCost,
        totalPrice,
        basePrice,
        isNightRate: false,
        isSunday: false
      });
    };
    
    calculatePrice();
  }, [estimatedDistance, selectedVehicle, hasReturnTrip, returnToSameAddress, 
      returnDistance, hasWaitingTime, waitingTimePrice, vehicles]);
  
  const handleDepartureSelect = useCallback((address: Address) => {
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  }, []);

  const handleDestinationSelect = useCallback((address: Address) => {
    setDestinationAddress(address.fullAddress);
    setDestinationCoordinates(address.coordinates);
  }, []);

  const handleReturnAddressSelect = useCallback((address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  }, []);

  const handleRouteCalculated = useCallback((distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  }, []);
  
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
        totalPrice,
        basePrice,
        isNightRate: false,
        isSunday: false
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
      
      setIsQuoteSent(true);
      
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
    setDepartureCoordinates(undefined);
    setDestinationCoordinates(undefined);
    setDate(new Date());
    setTime('09:00');
    setSelectedVehicle('');
    setPassengers('1');
    setHasReturnTrip(false);
    setHasWaitingTime(false);
    setWaitingTimeMinutes(15);
    setReturnToSameAddress(true);
    setCustomReturnAddress('');
    setCustomReturnCoordinates(undefined);
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
    setIsQuoteSent,
    
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
