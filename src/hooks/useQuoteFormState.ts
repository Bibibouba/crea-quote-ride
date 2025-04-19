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
import { useQuoteCalculation } from './quote/useQuoteCalculation';
import { useFormHandlers } from './quote/useFormHandlers';
import { QuoteDetailsType } from '@/types/quoteForm';
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
  
  // Address form state
  const addressForm = useAddressForm();
  
  // Trip options state with proper waitingTimeOptions
  const tripOptions = useTripOptions({
    waitingTimeOptions: waitingTimeOptions()
  });
  
  // Client data state
  const clientData = useClientData({ clientId });
  
  // Form UI state
  const formState = useFormState();
  
  // Route calculation
  const {
    oneWayDistance,
    oneWayDuration,
    returnDistance,
    returnDuration,
    totalDuration,
    handleRouteCalculated,
    handleReturnRouteCalculated
  } = useRouteCalculation({
    hasReturnTrip: tripOptions.hasReturnTrip,
    returnToSameAddress: tripOptions.returnToSameAddress,
    destinationCoordinates: addressForm.destinationCoordinates,
    customReturnCoordinates: addressForm.customReturnCoordinates
  });
  
  // Form handlers
  const { handleSubmit: baseHandleSubmit, handleReset: baseHandleReset } = useFormHandlers({
    setShowQuote: formState.setShowQuote,
    setIsLoading: formState.setIsLoading
  });
  
  // Quote calculations
  const { totalDistance, basePrice, estimatedPrice } = useQuoteCalculation({
    oneWayDistance,
    returnDistance,
    vehicles,
    selectedVehicle
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
    estimatedDistance: oneWayDistance,
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
    estimatedDistance: oneWayDistance,
    estimatedDuration: oneWayDuration,
    selectedVehicle,
    vehicles,
    pricingSettings
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    baseHandleSubmit(
      e,
      addressForm.departureCoordinates,
      addressForm.destinationCoordinates
    );
  };
  
  // Handle saving quote
  const handleQuoteSave = async () => {
    await handleSaveQuote(
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
  
  // Handle reset
  const handleReset = () => {
    baseHandleReset();
    setIsQuoteSent(false);
  };
  
  return {
    ...addressForm,
    ...clientData,
    ...tripOptions,
    ...formState,
    oneWayDistance,
    oneWayDuration,
    returnDistance,
    returnDuration,
    totalDistance,
    totalDuration,
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle,
    waitingTimePrice,
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    basePrice,
    estimatedPrice,
    quoteDetails,
    handleSubmit,
    handleSaveQuote: handleQuoteSave,
    handleRouteCalculated,
    handleReturnRouteCalculated,
    handleReset
  };
};
