
import { useEffect } from 'react';
import { useMapbox } from '@/hooks/useMapbox';
import { toast } from 'sonner';

import { useTripDetails, QuoteFormStep } from './quote/useTripDetails';
import { useClientInfo } from './quote/useClientInfo';
import { useQuotePricing } from './quote/useQuotePricing';
import { useQuoteSubmission } from './quote/useQuoteSubmission';
import { useFormNavigation } from './quote/useFormNavigation';

export type { QuoteFormStep, WaitingTimeOption } from './quote/useTripDetails';

export function useQuoteForm() {
  const { getRoute } = useMapbox();
  
  const tripDetails = useTripDetails();
  const clientInfo = useClientInfo();
  const quotePricing = useQuotePricing(
    tripDetails.selectedVehicle,
    tripDetails.estimatedDistance,
    tripDetails.estimatedDuration,  // Add the missing estimatedDuration parameter
    tripDetails.time,
    tripDetails.hasReturnTrip,
    tripDetails.returnToSameAddress,
    tripDetails.returnDistance,
    tripDetails.returnDuration,     // Add the missing returnDuration parameter
    tripDetails.hasWaitingTime,
    tripDetails.waitingTimeMinutes
  );
  const quoteSubmission = useQuoteSubmission();
  const formNavigation = useFormNavigation();
  
  // Calculate return route when appropriate
  useEffect(() => {
    const calculateReturnRoute = async () => {
      if (
        !tripDetails.hasReturnTrip || 
        tripDetails.returnToSameAddress || 
        !tripDetails.customReturnCoordinates || 
        !tripDetails.destinationCoordinates
      ) {
        return;
      }
      
      try {
        const route = await getRoute(
          tripDetails.destinationCoordinates, 
          tripDetails.customReturnCoordinates
        );
        
        if (route) {
          tripDetails.setReturnDistance(Math.round(route.distance));
          tripDetails.setReturnDuration(Math.round(route.duration));
        }
      } catch (error) {
        console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
      }
    };
    
    calculateReturnRoute();
  }, [
    tripDetails.hasReturnTrip,
    tripDetails.returnToSameAddress,
    tripDetails.customReturnCoordinates,
    tripDetails.destinationCoordinates,
    getRoute
  ]);
  
  // Form validation
  const validateTripForm = (): boolean => {
    console.log("Validating form with values:", {
      departureAddress: tripDetails.departureAddress,
      destinationAddress: tripDetails.destinationAddress,
      date: tripDetails.date,
      time: tripDetails.time,
      selectedVehicle: tripDetails.selectedVehicle,
      departureCoordinates: tripDetails.departureCoordinates,
      destinationCoordinates: tripDetails.destinationCoordinates
    });
    
    if (
      !tripDetails.departureAddress || 
      !tripDetails.destinationAddress || 
      !tripDetails.date || 
      !tripDetails.time || 
      !tripDetails.selectedVehicle || 
      !tripDetails.departureCoordinates || 
      !tripDetails.destinationCoordinates
    ) {
      console.error("Cannot proceed: missing required fields");
      toast.error('Veuillez remplir tous les champs requis et sélectionner des adresses valides');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (formNavigation.activeTab === 'step1') {
      return formNavigation.handleNextStep(validateTripForm);
    }
    
    return formNavigation.handleNextStep();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await quoteSubmission.submitQuote({
      firstName: clientInfo.firstName,
      lastName: clientInfo.lastName,
      email: clientInfo.email,
      departureAddress: tripDetails.departureAddress,
      destinationAddress: tripDetails.destinationAddress,
      departureCoordinates: tripDetails.departureCoordinates,
      destinationCoordinates: tripDetails.destinationCoordinates,
      date: tripDetails.date,
      time: tripDetails.time,
      selectedVehicle: tripDetails.selectedVehicle,
      estimatedDistance: tripDetails.estimatedDistance,
      estimatedDuration: tripDetails.estimatedDuration,
      price: quotePricing.price,
      hasReturnTrip: tripDetails.hasReturnTrip,
      hasWaitingTime: tripDetails.hasWaitingTime,
      waitingTimeMinutes: tripDetails.waitingTimeMinutes,
      waitingTimePrice: quotePricing.waitingTimePrice,
      returnToSameAddress: tripDetails.returnToSameAddress,
      customReturnAddress: tripDetails.customReturnAddress,
      customReturnCoordinates: tripDetails.customReturnCoordinates,
      returnDistance: tripDetails.returnDistance,
      returnDuration: tripDetails.returnDuration
    });
  };
  
  const resetForm = () => {
    formNavigation.resetForm();
    quoteSubmission.resetSubmissionState();
  };
  
  return {
    // Trip details
    ...tripDetails,
    
    // Client information
    ...clientInfo,
    
    // Pricing information
    price: quotePricing.price,
    quoteDetails: quotePricing.quoteDetails,
    vehiclesLoading: quotePricing.vehiclesLoading,
    pricingLoading: quotePricing.pricingLoading,
    vehicles: quotePricing.vehicles,
    
    // Submission state
    isSubmitting: quoteSubmission.isSubmitting,
    isQuoteSent: quoteSubmission.isQuoteSent,
    
    // Navigation
    activeTab: formNavigation.activeTab,
    setActiveTab: formNavigation.setActiveTab,
    navigate: formNavigation.navigate,
    
    // Action handlers
    handleNextStep,
    handlePreviousStep: formNavigation.handlePreviousStep,
    handleSubmit,
    resetForm
  };
}
