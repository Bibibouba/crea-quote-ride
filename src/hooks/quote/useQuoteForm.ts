
import { useState } from 'react';
import { Address } from '@/hooks/useMapbox';
import { usePricing } from '@/hooks/use-pricing';
import { useVehicleData } from './useVehicleData';
import { useWaitingTimeCalculation } from './useWaitingTimeCalculation';
import { useRouteCalculation } from './useRouteCalculation';
import { useQuoteDetails } from './useQuoteDetails';
import { useSaveQuote } from './useSaveQuote';

export const useQuoteForm = () => {
  const { pricingSettings } = usePricing();
  
  // Address state
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  
  // Trip details state
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [passengers, setPassengers] = useState('1');
  
  // UI state
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Customer info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Route data
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  // Options state
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  
  // Use our new modular hooks
  const {
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle
  } = useVehicleData();
  
  const {
    waitingTimePrice,
    waitingTimeOptions
  } = useWaitingTimeCalculation({
    hasWaitingTime,
    waitingTimeMinutes,
    selectedVehicle,
    vehicles,
    pricingSettings,
    time,
    date
  });
  
  const {
    returnDistance,
    returnDuration,
    handleRouteCalculated: routeHandler
  } = useRouteCalculation({
    hasReturnTrip,
    returnToSameAddress,
    destinationCoordinates,
    customReturnCoordinates
  });
  
  const { quoteDetails } = useQuoteDetails({
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
  });
  
  const {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote
  } = useSaveQuote({
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
  });
  
  // Helper functions
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
    const { estimatedDistance: newDistance, estimatedDuration: newDuration } = routeHandler(distance, duration);
    setEstimatedDistance(newDistance);
    setEstimatedDuration(newDuration);
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
    setReturnToSameAddress(true);
    setCustomReturnAddress('');
    setCustomReturnCoordinates(undefined);
    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  };
  
  // Calculate the base price based on the selected vehicle
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  
  // Import toast since we're using it in handleCalculateQuote
  const { toast } = require('@/hooks/use-toast');
  
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
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    setCustomReturnCoordinates,
    returnDistance,
    returnDuration,
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
