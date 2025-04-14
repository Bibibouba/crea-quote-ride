
import { useEffect, useState } from 'react';
import { useMapbox, Address } from './useMapbox';
import { usePricing } from './use-pricing';
import { useVehicleTypes } from './useVehicleTypes';
import { supabase } from '@/integrations/supabase/client';
import { generateWaitingTimeOptions } from '@/utils/waitingTimeOptions';
import { fetchVehicles } from '@/utils/vehicleUtils';
import { calculateWaitingTimePrice, calculateQuoteDetails } from '@/utils/pricingUtils';
import { 
  Vehicle, 
  WaitingTimeOption, 
  QuoteDetails, 
  PricingSettings,
  QuoteFormState
} from '@/types/quoteForm';

export { WaitingTimeOption };

export const useQuoteForm = () => {
  const { getRoute } = useMapbox();
  const { pricingSettings } = usePricing();
  const { vehicleTypes, loading: isLoadingVehicleTypes } = useVehicleTypes();

  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');

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

  const [currentStep, setCurrentStep] = useState(1);
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);

  const [selectedClient, setSelectedClient] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null);

  const waitingTimeOptions = generateWaitingTimeOptions();

  // Load vehicles when vehicle types are available
  useEffect(() => {
    if (vehicleTypes.length > 0) {
      setIsLoadingVehicles(true);
      
      const handleVehiclesLoaded = (vehicles: Vehicle[], newSelectedVehicle?: string) => {
        setVehicles(vehicles);
        setIsLoadingVehicles(false);
        
        if (newSelectedVehicle) {
          setSelectedVehicle(newSelectedVehicle);
        }
      };
      
      const fetchUserVehicles = async () => {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user?.id;
        
        if (userId) {
          await fetchVehicles(userId, vehicleTypes, selectedVehicle, handleVehiclesLoaded);
        }
      };
      
      fetchUserVehicles();
    }
  }, [vehicleTypes, selectedVehicle]);

  // Calculate waiting time price
  useEffect(() => {
    const price = calculateWaitingTimePrice(hasWaitingTime, waitingTimeMinutes, pricingSettings, time);
    setWaitingTimePrice(price);
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time]);

  // Calculate return route
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

  // Calculate quote details
  useEffect(() => {
    const details = calculateQuoteDetails(
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
    );
    
    setQuoteDetails(details);
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetForm = () => {
    setCurrentStep(1);
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
    
    currentStep,
    setCurrentStep,
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
    
    vehicles,
    isLoadingVehicles,
    waitingTimeOptions,
    
    quoteDetails,
    
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    nextStep,
    prevStep,
    resetForm
  };
};
