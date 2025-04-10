import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { usePricing } from '@/hooks/use-pricing';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/AuthContext';

export type QuoteFormStep = 'step1' | 'step2' | 'step3';

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export function useQuoteForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { addQuote } = useQuotes();
  const { getRoute } = useMapbox();
  const { 
    pricingSettings, 
    loading: pricingLoading,
    distanceTiers
  } = usePricing();
  
  // Form state
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
  const [estimatedDistance, setEstimatedDistance] = useState(40);
  const [estimatedDuration, setEstimatedDuration] = useState(45);
  const [price, setPrice] = useState(0);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  
  // Return trip options
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  
  // Fetch user info
  useEffect(() => {
    if (user) {
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
  }, [user]);
  
  // Calculate waiting time price
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
    const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
    
    // Calculate by quarter-hour increments using wait_price_per_15min
    const quarters = Math.ceil(waitingTimeMinutes / 15);
    let price = quarters * pricePerQuarter;
    
    // Apply night rate if enabled
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
  
  // Calculate return trip distance and duration
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
  
  // Calculate price based on distance, vehicle, and options
  useEffect(() => {
    if (!selectedVehicle || !pricingSettings || !distanceTiers) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    const vehicleTypeId = vehicle.vehicle_type_id;
    
    let pricePerKm = pricingSettings.price_per_km;
    
    if (distanceTiers && distanceTiers.length > 0) {
      const applicableTiers = distanceTiers.filter(tier => 
        !tier.vehicle_id || tier.vehicle_id === vehicleTypeId
      );
      
      const applicableTier = applicableTiers.find(tier => 
        estimatedDistance >= tier.min_km && 
        (!tier.max_km || estimatedDistance <= tier.max_km)
      );
      
      if (applicableTier) {
        pricePerKm = applicableTier.price_per_km;
      }
    }
    
    // Prix de base pour le trajet aller
    let oneWayPrice = pricingSettings.base_fare + (estimatedDistance * pricePerKm);
    
    // Appliquer le tarif de nuit si actif
    if (pricingSettings.night_rate_enabled && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.night_rate_start?.split(':').map(Number) || [0, 0];
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      if (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      ) {
        const nightPercentage = pricingSettings.night_rate_percentage || 0;
        oneWayPrice += oneWayPrice * (nightPercentage / 100);
      }
    }
    
    // Appliquer le prix minimum si nécessaire
    if (oneWayPrice < pricingSettings.min_fare) {
      oneWayPrice = pricingSettings.min_fare;
    }
    
    // Calculer le prix du retour si nécessaire
    let returnPrice = 0;
    if (hasReturnTrip) {
      if (returnToSameAddress) {
        returnPrice = oneWayPrice;
      } else if (returnDistance > 0) {
        returnPrice = pricingSettings.base_fare + (returnDistance * pricePerKm);
        
        // Appliquer le prix minimum si nécessaire
        if (returnPrice < pricingSettings.min_fare) {
          returnPrice = pricingSettings.min_fare;
        }
      }
    }
    
    // Calculer le prix total
    const totalPrice = oneWayPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
    
    setPrice(Math.round(totalPrice));
    
    setQuoteDetails({
      departureAddress,
      destinationAddress,
      customReturnAddress,
      date: date ? format(date, 'dd/MM/yyyy') : '',
      time,
      vehicleName: vehicle.name,
      vehicleModel: vehicle.model,
      distance: estimatedDistance,
      duration: estimatedDuration,
      returnDistance,
      returnDuration,
      baseFare: pricingSettings.base_fare,
      pricePerKm,
      oneWayPrice: Math.round(oneWayPrice),
      waitingTimePrice: hasWaitingTime ? waitingTimePrice : 0,
      returnPrice: Math.round(returnPrice),
      totalPrice: Math.round(totalPrice),
      hasReturnTrip,
      hasWaitingTime,
      waitingTimeMinutes,
      returnToSameAddress
    });
  }, [
    selectedVehicle, departureAddress, destinationAddress, date, time, 
    estimatedDistance, vehicles, pricingSettings, distanceTiers,
    hasReturnTrip, hasWaitingTime, waitingTimePrice, waitingTimeMinutes,
    returnToSameAddress, customReturnAddress, returnDistance
  ]);
  
  const handleNextStep = () => {
    if (activeTab === 'step1') {
      if (!departureAddress || !destinationAddress || !date || !time || !selectedVehicle) {
        toast.error('Veuillez remplir tous les champs requis');
        return;
      }
      setActiveTab('step2');
    } else if (activeTab === 'step2') {
      setActiveTab('step3');
    }
  };
  
  const handlePreviousStep = () => {
    if (activeTab === 'step2') {
      setActiveTab('step1');
    } else if (activeTab === 'step3') {
      setActiveTab('step2');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    if (!departureCoordinates || !destinationCoordinates) {
      toast.error('Veuillez sélectionner des adresses valides pour le calcul du trajet');
      return;
    }
    
    if (hasReturnTrip && !returnToSameAddress && !customReturnAddress) {
      toast.error('Veuillez spécifier une adresse de retour');
      return;
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
      
      toast.success('Votre devis a été enregistré avec succès');
      setIsSubmitting(false);
      setIsQuoteSent(true);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsSubmitting(false);
    }
  };

  const handleDepartureSelect = (address: Address) => {
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  };

  const handleDestinationSelect = (address: Address) => {
    setDestinationAddress(address.fullAddress);
    setDestinationCoordinates(address.coordinates);
  };

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  };

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };
  
  // Generate waiting time options in 15-minute increments
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

  const resetForm = () => {
    setActiveTab('step1');
    setIsQuoteSent(false);
  };
  
  return {
    // Form state
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
    price,
    quoteDetails,
    isSubmitting,
    isQuoteSent,
    
    // Return trip state
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
    
    // Loading states
    vehiclesLoading,
    pricingLoading,
    vehicles,
    
    // Handlers
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
