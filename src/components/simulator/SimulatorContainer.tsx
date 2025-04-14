
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteForm } from '@/hooks/useQuoteForm';
import { useClientSimulator } from '@/hooks/useClientSimulator';
import SimulatorHeader from './steps/SimulatorHeader';
import SimulatorLoading from './SimulatorLoading';
import SuccessMessageStep from '@/components/quote/form/SuccessMessageStep';
import SimulatorTabs from './SimulatorTabs';

const SimulatorContainer = () => {
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3'>('step1');
  const { toast } = useToast();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const {
    isSubmitting,
    isQuoteSent,
    submitQuote,
    resetForm,
    navigateToDashboard
  } = useClientSimulator();
  
  const quoteFormState = useQuoteForm();
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthChecking(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No active session found in client simulator');
          toast({
            title: 'Authentification requise',
            description: 'Vous devez être connecté pour utiliser le simulateur client',
            variant: 'destructive',
          });
        } else {
          console.log('Active session found for user:', session.user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [toast]);
  
  // Navigation functions
  const handleNextStep = () => {
    if (activeTab === 'step1') {
      setActiveTab('step2');
    } else if (activeTab === 'step2') {
      setActiveTab('step3');
    }
  };

  const handlePreviousStep = () => {
    if (activeTab === 'step3') {
      setActiveTab('step2');
    } else if (activeTab === 'step2') {
      setActiveTab('step1');
    }
  };

  const handleSubmit = async () => {
    // Préparer les données du devis
    const quoteData = {
      departure_location: quoteFormState.departureAddress,
      arrival_location: quoteFormState.destinationAddress,
      departure_coordinates: quoteFormState.departureCoordinates,
      arrival_coordinates: quoteFormState.destinationCoordinates,
      distance_km: quoteFormState.estimatedDistance,
      duration_minutes: quoteFormState.estimatedDuration,
      ride_date: new Date(quoteFormState.date).toISOString(),
      amount: quoteFormState.quoteDetails?.totalPrice || 0,
      vehicle_id: quoteFormState.selectedVehicle,
      has_return_trip: quoteFormState.hasReturnTrip,
      has_waiting_time: quoteFormState.hasWaitingTime,
      waiting_time_minutes: quoteFormState.hasWaitingTime ? quoteFormState.waitingTimeMinutes : 0,
      waiting_time_price: quoteFormState.hasWaitingTime ? quoteFormState.waitingTimePrice : 0,
      return_to_same_address: quoteFormState.returnToSameAddress,
      custom_return_address: quoteFormState.customReturnAddress,
      return_coordinates: quoteFormState.customReturnCoordinates,
      return_distance_km: quoteFormState.returnDistance,
      return_duration_minutes: quoteFormState.returnDuration
    };
    
    // Préparer les données du client
    const clientData = {
      firstName: quoteFormState.firstName,
      lastName: quoteFormState.lastName,
      email: quoteFormState.email,
      phone: quoteFormState.phone
    };
    
    // Soumettre le devis
    await submitQuote(quoteData, clientData);
  };
  
  if (isAuthChecking || quoteFormState.isLoadingVehicles) {
    return <SimulatorLoading />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <SimulatorHeader />
        <CardContent>
          {isQuoteSent ? (
            <SuccessMessageStep 
              email={quoteFormState.email}
              resetForm={resetForm}
              navigateToDashboard={navigateToDashboard}
            />
          ) : (
            <SimulatorTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formState={quoteFormState}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulatorContainer;
