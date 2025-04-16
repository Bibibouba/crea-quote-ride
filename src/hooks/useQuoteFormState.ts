
import { useAddressForm } from './quote/useAddressForm';
import { useClientData } from './quote/useClientData';
import { useFormState } from './quote/useFormState';
import { usePricing } from './use-pricing';
import { useQuoteDetails } from './quote/useQuoteDetails';
import { useRouteCalculation } from './quote/useRouteCalculation';
import { useSaveQuote } from './quote/useSaveQuote';
import { useTripOptions } from './quote/useTripOptions';
import { useVehicleData } from './quote/useVehicleData';
import { useWaitingTimeCalculation } from './quote/useWaitingTimeCalculation';
import { waitingTimeOptions } from '@/utils/waitingTimeOptions';

export interface UseQuoteFormStateProps {
  clientId?: string;
  onSuccess?: () => void;
}

export const useQuoteFormState = ({ clientId, onSuccess }: UseQuoteFormStateProps = {}) => {
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
  
  // Generate waiting time options
  const waitingTimeOptionsList = waitingTimeOptions();
  
  // Address form state
  const addressForm = useAddressForm();
  
  // Trip options state
  const tripOptions = useTripOptions({ waitingTimeOptions: waitingTimeOptionsList });
  
  // Client data state
  const clientData = useClientData({ clientId });
  
  // Form UI state
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
    returnDistance: returnDistance,
    hasReturnTrip: tripOptions.hasReturnTrip,
    returnToSameAddress: tripOptions.returnToSameAddress,
    vehicles,
    hasWaitingTime: tripOptions.hasWaitingTime,
    waitingTimePrice,
    time: tripOptions.time,
    date: tripOptions.date,
    pricingSettings
  });
  
  // Save quote logic
  const {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote: saveQuote
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
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    formState.handleSubmit(
      e, 
      addressForm.departureCoordinates, 
      addressForm.destinationCoordinates
    );
  };
  
  // Handle saving quote
  const handleSaveQuote = async () => {
    await saveQuote(
      clientData.firstName,
      clientData.lastName,
      clientData.email,
      clientData.phone,
      clientData.selectedClient
    );
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  // Handle route calculation
  const handleRouteCalculated = (distance: number, duration: number) => {
    const { estimatedDistance, estimatedDuration } = routeHandler(distance, duration);
    tripOptions.setEstimatedDistance(estimatedDistance);
    tripOptions.setEstimatedDuration(estimatedDuration);
  };
  
  // Handle reset
  const handleReset = () => {
    formState.handleReset();
    setIsQuoteSent(false);
  };
  
  // Calculate base price
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  
  // Calculate estimated price
  const estimatedPrice = Math.round(tripOptions.estimatedDistance * basePrice);
  
  return {
    // Address state
    ...addressForm,
    
    // Client data
    ...clientData,
    
    // Trip options
    ...tripOptions,
    
    // Form state
    ...formState,
    
    // Additional state
    returnDistance,
    returnDuration,
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle,
    waitingTimePrice,
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    
    // Calculated values
    basePrice,
    estimatedPrice,
    quoteDetails,
    
    // Handlers
    handleSubmit,
    handleSaveQuote,
    handleRouteCalculated,
    handleReset
  };
};
