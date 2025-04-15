import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { calculateWaitingTimePrice, calculateQuoteDetails } from '@/utils/pricing';
import { usePricing } from '@/hooks/use-pricing';
import { VehicleType } from '@/types/vehicle';
import { Vehicle, QuoteDetails } from '@/types/quoteForm';
import { fetchVehicles } from '@/utils/vehicleUtils';

export const useQuoteForm = () => {
  const { toast } = useToast();
  const { getRoute } = useMapbox();
  const { pricingSettings } = usePricing();
  
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
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);
  
  useEffect(() => {
    const loadVehicleData = async () => {
      setIsLoadingVehicles(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const driverId = session?.user?.id;
        
        if (!driverId) {
          console.log('No authenticated driver found');
          setIsLoadingVehicles(false);
          return;
        }
        
        const { data: types, error: typesError } = await supabase
          .from('vehicle_types')
          .select('*')
          .eq('driver_id', driverId);
          
        if (typesError) throw typesError;
        
        setVehicleTypes(types || []);
        
        await fetchVehicles(driverId, types || [], selectedVehicle, setVehiclesWithPricing);
      } catch (error) {
        console.error('Error loading vehicle data:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les véhicules',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingVehicles(false);
      }
    };
    
    loadVehicleData();
  }, [toast]);
  
  const setVehiclesWithPricing = useCallback((loadedVehicles: Vehicle[], vehicleId?: string) => {
    setVehicles(loadedVehicles);
    if (vehicleId) {
      setSelectedVehicle(vehicleId);
    } else if (loadedVehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(loadedVehicles[0].id);
    }
  }, [selectedVehicle]);
  
  useEffect(() => {
    if (!hasWaitingTime) {
      setWaitingTimePrice(0);
      return;
    }
    
    const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
    const price = calculateWaitingTimePrice(
      hasWaitingTime,
      waitingTimeMinutes,
      pricingSettings,
      time,
      selectedVehicleInfo
    );
    
    setWaitingTimePrice(price);
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time, vehicles, selectedVehicle]);
  
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
  
  useEffect(() => {
    if (!selectedVehicle || estimatedDistance === 0 || vehicles.length === 0) {
      setQuoteDetails(null);
      return;
    }
    
    const calculatedQuote = calculateQuoteDetails(
      selectedVehicle,
      estimatedDistance,
      returnToSameAddress ? estimatedDistance : returnDistance,
      hasReturnTrip,
      returnToSameAddress,
      vehicles,
      hasWaitingTime,
      waitingTimePrice,
      time,
      date,
      pricingSettings
    );
    
    setQuoteDetails(calculatedQuote);
  }, [
    selectedVehicle,
    estimatedDistance,
    returnDistance,
    hasReturnTrip,
    returnToSameAddress,
    vehicles,
    hasWaitingTime,
    waitingTimePrice,
    time,
    date,
    pricingSettings
  ]);
  
  const handleDepartureAddressSelect = (address: Address) => {
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  };
  
  const handleDestinationAddressSelect = (address: Address) => {
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
  
  const handleCalculateQuote = () => {
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
  
  const resetForm = () => {
    setDepartureAddress('');
    setDestinationAddress('');
    setDepartureCoordinates(undefined);
    setDestinationCoordinates(undefined);
    setDate(new Date());
    setTime('12:00');
    setPassengers('1');
    setShowQuote(false);
    setIsQuoteSent(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setEstimatedDistance(0);
    setEstimatedDuration(0);
    setHasReturnTrip(false);
    setHasWaitingTime(false);
    setWaitingTimeMinutes(15);
    setWaitingTimePrice(0);
    setReturnToSameAddress(true);
    setCustomReturnAddress('');
    setCustomReturnCoordinates(undefined);
    setReturnDistance(0);
    setReturnDuration(0);
    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  };
  
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  
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
  
  const handleSaveQuote = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const driverId = session?.user?.id;
      
      if (!driverId) {
        console.log('No authenticated driver found');
        setIsSubmitting(false);
        return;
      }
      
      const quoteData = {
        driver_id: driverId,
        client_id: "", // This needs to be set depending on your app flow
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        ride_date: date.toISOString(),
        amount: quoteDetails?.totalPrice || 0,
        status: "pending",
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration,
        has_return_trip: hasReturnTrip,
        return_to_same_address: returnToSameAddress,
        return_distance_km: returnDistance,
        return_duration_minutes: returnDuration,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: waitingTimeMinutes,
        waiting_time_price: waitingTimePrice,
        day_km: quoteDetails?.dayKm,
        night_km: quoteDetails?.nightKm,
        total_km: quoteDetails?.totalKm,
        day_price: quoteDetails?.dayPrice,
        night_price: quoteDetails?.nightPrice,
        has_night_rate: quoteDetails?.isNightRate,
        night_hours: quoteDetails?.nightHours,
        night_rate_percentage: quoteDetails?.nightRatePercentage,
        night_surcharge: quoteDetails?.nightSurcharge,
        is_sunday_holiday: quoteDetails?.isSunday,
        sunday_holiday_percentage: quoteDetails?.sundayRate,
        sunday_holiday_surcharge: quoteDetails?.sundaySurcharge
      };
      
      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select();
      
      if (error) {
        console.error('Error saving quote:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder la demande',
          variant: 'destructive',
        });
      } else {
        setIsQuoteSent(true);
        toast({
          title: 'Demande sauvegardée',
          description: 'Votre demande a été enregistrée avec succès',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la demande',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
    vehicleTypes,
    isLoadingVehicles,
    basePrice,
    waitingTimeOptions,
    quoteDetails,
    handleDepartureAddressSelect,
    handleDestinationAddressSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    handleCalculateQuote,
    resetForm,
    handleSaveQuote
  };
};
