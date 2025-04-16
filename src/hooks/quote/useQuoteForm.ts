
import { useState } from 'react';
import { Address } from '@/hooks/useMapbox';
import { useAddressForm } from './useAddressForm';
import { useClientData } from './useClientData';
import { useFormState } from './useFormState';
import { usePricing } from '@/hooks/use-pricing';
import { useQuoteDetails } from './useQuoteDetails';
import { useRouteCalculation } from './useRouteCalculation';
import { useSaveQuote } from './useSaveQuote';
import { useTripOptions } from './useTripOptions';
import { useVehicleData } from './useVehicleData';
import { useWaitingTimeCalculation } from './useWaitingTimeCalculation';
import { waitingTimeOptions as generateWaitingTimeOptions } from '@/utils/waitingTimeOptions';
import { QuoteDetailsType } from '@/types/quoteForm';

/**
 * Legacy hook for backward compatibility
 * This hook composes smaller hooks to maintain the same API
 */
export const useQuoteForm = () => {
  // Load pricing settings
  const { pricingSettings } = usePricing();
  
  // Get vehicle data
  const {
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle
  } = useVehicleData();
  
  // Get waiting time options
  const waitingTimeOptions = generateWaitingTimeOptions();
  
  // Address form state
  const addressForm = useAddressForm();
  
  // Trip options state
  const tripOptions = useTripOptions({ waitingTimeOptions });
  
  // Client data state
  const clientData = useClientData();
  
  // Form state (UI state)
  const formState = useFormState();
  
  // Route calculation
  const {
    returnDistance,
    returnDuration,
    handleRouteCalculated: routeHandler
  } = useRouteCalculation({
    hasReturnTrip: tripOptions.hasReturnTrip,
    returnToSameAddress: tripOptions.returnToSameAddress,
    destinationCoordinates: addressForm.destinationCoordinates,
    customReturnCoordinates: addressForm.customReturnCoordinates
  });
  
  // Calculate waiting time price
  const {
    waitingTimePrice
  } = useWaitingTimeCalculation({
    hasWaitingTime: tripOptions.hasWaitingTime,
    waitingTimeMinutes: tripOptions.waitingTimeMinutes,
    selectedVehicle,
    vehicles,
    pricingSettings,
    time: tripOptions.time,
    date: tripOptions.date
  });
  
  // Calculate quote details
  const { quoteDetails } = useQuoteDetails({
    selectedVehicle,
    estimatedDistance: tripOptions.estimatedDistance,
    returnDistance,
    hasReturnTrip: tripOptions.hasReturnTrip,
    returnToSameAddress: tripOptions.returnToSameAddress,
    vehicles,
    hasWaitingTime: tripOptions.hasWaitingTime,
    waitingTimePrice,
    time: tripOptions.time,
    date: tripOptions.date,
    pricingSettings
  });
  
  // Handle route calculation
  const handleRouteCalculated = (distance: number, duration: number) => {
    const { estimatedDistance: newDistance, estimatedDuration: newDuration } = routeHandler(distance, duration);
    tripOptions.setEstimatedDistance(newDistance);
    tripOptions.setEstimatedDuration(newDuration);
  };
  
  // Save quote logic
  const {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote
  } = useSaveQuote({
    quoteDetails: quoteDetails as QuoteDetailsType,
    departureAddress: addressForm.departureAddress,
    destinationAddress: addressForm.destinationAddress,
    departureCoordinates: addressForm.departureCoordinates,
    destinationCoordinates: addressForm.destinationCoordinates,
    date: tripOptions.date,
    time: tripOptions.time,
    hasReturnTrip: tripOptions.hasReturnTrip,
    returnToSameAddress: tripOptions.returnToSameAddress,
    customReturnAddress: addressForm.customReturnAddress,
    customReturnCoordinates: addressForm.customReturnCoordinates,
    returnDistance,
    returnDuration,
    hasWaitingTime: tripOptions.hasWaitingTime,
    waitingTimeMinutes: tripOptions.waitingTimeMinutes,
    waitingTimePrice,
    estimatedDistance: tripOptions.estimatedDistance,
    estimatedDuration: tripOptions.estimatedDuration,
    selectedVehicle,
    vehicles,
    pricingSettings
  });
  
  // Calculate base price
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  
  // Helper functions that used to be directly in useQuoteForm
  const handleCalculateQuote = () => {
    formState.handleSubmit(
      new Event('submit') as unknown as React.FormEvent,
      addressForm.departureCoordinates,
      addressForm.destinationCoordinates
    );
  };
  
  const resetForm = () => {
    // Reset address form
    addressForm.setDepartureAddress('');
    addressForm.setDestinationAddress('');
    addressForm.setDepartureCoordinates(undefined);
    addressForm.setDestinationCoordinates(undefined);
    addressForm.setCustomReturnAddress('');
    addressForm.setCustomReturnCoordinates(undefined);
    
    // Reset trip options
    tripOptions.setDate(new Date());
    tripOptions.setTime('12:00');
    tripOptions.setPassengers('1');
    tripOptions.setEstimatedDistance(0);
    tripOptions.setEstimatedDuration(0);
    tripOptions.setHasReturnTrip(false);
    tripOptions.setHasWaitingTime(false);
    tripOptions.setWaitingTimeMinutes(15);
    tripOptions.setReturnToSameAddress(true);
    
    // Reset form state
    formState.setShowQuote(false);
    setIsQuoteSent(false);
    
    // Reset client data
    clientData.setFirstName('');
    clientData.setLastName('');
    clientData.setEmail('');
    clientData.setPhone('');
    
    // Reset vehicle selection
    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  };
  
  return {
    // Address state
    departureAddress: addressForm.departureAddress,
    setDepartureAddress: addressForm.setDepartureAddress,
    destinationAddress: addressForm.destinationAddress,
    setDestinationAddress: addressForm.setDestinationAddress,
    departureCoordinates: addressForm.departureCoordinates,
    setDepartureCoordinates: addressForm.setDepartureCoordinates,
    destinationCoordinates: addressForm.destinationCoordinates,
    setDestinationCoordinates: addressForm.setDestinationCoordinates,
    
    // Trip state
    date: tripOptions.date,
    setDate: tripOptions.setDate,
    time: tripOptions.time,
    setTime: tripOptions.setTime,
    passengers: tripOptions.passengers,
    setPassengers: tripOptions.setPassengers,
    
    // UI state
    showQuote: formState.showQuote,
    setShowQuote: formState.setShowQuote,
    isLoading: formState.isLoading,
    setIsLoading: formState.setIsLoading,
    
    // Quote status
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    
    // Client info
    firstName: clientData.firstName,
    setFirstName: clientData.setFirstName,
    lastName: clientData.lastName,
    setLastName: clientData.setLastName,
    email: clientData.email,
    setEmail: clientData.setEmail,
    phone: clientData.phone,
    setPhone: clientData.setPhone,
    
    // Route data
    estimatedDistance: tripOptions.estimatedDistance,
    setEstimatedDistance: tripOptions.setEstimatedDistance,
    estimatedDuration: tripOptions.estimatedDuration,
    setEstimatedDuration: tripOptions.setEstimatedDuration,
    
    // Options
    hasReturnTrip: tripOptions.hasReturnTrip,
    setHasReturnTrip: tripOptions.setHasReturnTrip,
    hasWaitingTime: tripOptions.hasWaitingTime,
    setHasWaitingTime: tripOptions.setHasWaitingTime,
    waitingTimeMinutes: tripOptions.waitingTimeMinutes,
    setWaitingTimeMinutes: tripOptions.setWaitingTimeMinutes,
    waitingTimePrice,
    returnToSameAddress: tripOptions.returnToSameAddress,
    setReturnToSameAddress: tripOptions.setReturnToSameAddress,
    customReturnAddress: addressForm.customReturnAddress,
    setCustomReturnAddress: addressForm.setCustomReturnAddress,
    customReturnCoordinates: addressForm.customReturnCoordinates,
    setCustomReturnCoordinates: addressForm.setCustomReturnCoordinates,
    
    // Return data
    returnDistance,
    returnDuration,
    
    // Vehicle data
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle,
    basePrice,
    
    // Options data
    waitingTimeOptions,
    
    // Quote details
    quoteDetails,
    
    // Handlers
    handleDepartureAddressSelect: addressForm.handleDepartureAddressSelect,
    handleDestinationAddressSelect: addressForm.handleDestinationAddressSelect,
    handleReturnAddressSelect: addressForm.handleReturnAddressSelect,
    handleRouteCalculated,
    handleCalculateQuote,
    resetForm,
    handleSaveQuote: handleSaveQuote
  };
};
