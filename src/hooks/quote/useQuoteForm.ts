
import { useAddressForm } from './useAddressForm';
import { useFormState } from './useFormState';
import { useTripOptions } from './useTripOptions';
import { useRouteCalculation } from './useRouteCalculation';
import { useRouteHandler } from './useRouteHandler';
import { useCalculateQuote } from './useCalculateQuote';
import { useFormReset } from './useFormReset';
import { useVehicleState } from './vehicle/useVehicleState';
import { usePriceCalculations } from './pricing/usePriceCalculations';
import { useQuoteSubmission } from './submission/useQuoteSubmission';
import { waitingTimeOptions } from '@/utils/waitingTimeOptions';
import { QuoteFormStateProps } from '@/types/quoteForm';

export const useQuoteForm = ({ clientId, onSuccess }: QuoteFormStateProps = {}) => {
  // Get vehicle and pricing data
  const vehicleState = useVehicleState();
  
  // Get waiting time options
  const waitingTimeOptionsList = waitingTimeOptions();
  
  // Address form state
  const addressForm = useAddressForm();
  
  // Trip options state
  const tripOptions = useTripOptions({ waitingTimeOptions: waitingTimeOptionsList });
  
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

  // Price calculations
  const { waitingTimePrice, quoteDetails } = usePriceCalculations({
    hasWaitingTime: tripOptions.hasWaitingTime,
    waitingTimeMinutes: tripOptions.waitingTimeMinutes,
    selectedVehicle: vehicleState.selectedVehicle,
    vehicles: vehicleState.vehicles,
    pricingSettings: vehicleState.pricingSettings,
    time: tripOptions.time,
    date: tripOptions.date,
    estimatedDistance: tripOptions.estimatedDistance,
    returnDistance,
    hasReturnTrip: tripOptions.hasReturnTrip,
    returnToSameAddress: tripOptions.returnToSameAddress
  });

  // Quote submission
  const quoteSubmission = useQuoteSubmission({
    quoteDetails,
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
    selectedVehicle: vehicleState.selectedVehicle,
    vehicles: vehicleState.vehicles,
    pricingSettings: vehicleState.pricingSettings,
    onSuccess
  });

  // Use the calculate quote hook
  const { handleCalculateQuote } = useCalculateQuote({
    handleSubmit: formState.handleSubmit,
    departureCoordinates: addressForm.departureCoordinates,
    destinationCoordinates: addressForm.destinationCoordinates
  });

  // Use the form reset hook
  const { resetForm } = useFormReset({
    setDepartureAddress: addressForm.setDepartureAddress,
    setDestinationAddress: addressForm.setDestinationAddress,
    setDepartureCoordinates: addressForm.setDepartureCoordinates,
    setDestinationCoordinates: addressForm.setDestinationCoordinates,
    setCustomReturnAddress: addressForm.setCustomReturnAddress,
    setCustomReturnCoordinates: addressForm.setCustomReturnCoordinates,
    setDate: tripOptions.setDate,
    setTime: tripOptions.setTime,
    setPassengers: tripOptions.setPassengers,
    setEstimatedDistance: tripOptions.setEstimatedDistance,
    setEstimatedDuration: tripOptions.setEstimatedDuration,
    setHasReturnTrip: tripOptions.setHasReturnTrip,
    setHasWaitingTime: tripOptions.setHasWaitingTime,
    setWaitingTimeMinutes: tripOptions.setWaitingTimeMinutes,
    setReturnToSameAddress: tripOptions.setReturnToSameAddress,
    setShowQuote: formState.setShowQuote,
    setIsQuoteSent: quoteSubmission.setIsQuoteSent,
    setFirstName: quoteSubmission.setFirstName,
    setLastName: quoteSubmission.setLastName,
    setEmail: quoteSubmission.setEmail,
    setPhone: quoteSubmission.setPhone,
    setSelectedVehicle: vehicleState.setSelectedVehicle,
    vehicles: vehicleState.vehicles
  });

  // Handle route calculation
  const handleRouteCalculated = (distance: number, duration: number) => {
    const { estimatedDistance, estimatedDuration } = routeHandler(distance, duration);
    tripOptions.setEstimatedDistance(estimatedDistance);
    tripOptions.setEstimatedDuration(estimatedDuration);
  };

  return {
    // Address state
    ...addressForm,
    
    // Trip options
    ...tripOptions,
    
    // Form state
    ...formState,
    
    // Vehicle state
    ...vehicleState,
    
    // Route data
    returnDistance,
    returnDuration,
    
    // Quote submission
    ...quoteSubmission,
    
    // Calculated values
    waitingTimePrice,
    quoteDetails,
    waitingTimeOptions: waitingTimeOptionsList,
    
    // Handlers
    handleCalculateQuote,
    handleRouteCalculated,
    resetForm
  };
};
