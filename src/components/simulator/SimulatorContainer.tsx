
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClientSimulator } from '@/hooks/useClientSimulator';
import SimulatorLoading from './SimulatorLoading';
import SimulatorHeader from './steps/SimulatorHeader';
import SimulatorTabs from './SimulatorTabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useQuoteForm } from '@/hooks/useQuoteForm';

const SimulatorContainer = () => {
  const { isSubmitting, isQuoteSent, submitQuote, resetForm, navigateToDashboard } = useClientSimulator();
  const [simulatorReady, setSimulatorReady] = useState(true);
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3'>('step1');
  const formState = useQuoteForm();

  // Simulate loading for a more engaging experience
  React.useEffect(() => {
    setSimulatorReady(false);
    const timeout = setTimeout(() => {
      setSimulatorReady(true);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);

  const handleNextStep = () => {
    if (activeTab === 'step1') setActiveTab('step2');
    else if (activeTab === 'step2') setActiveTab('step3');
  };

  const handlePreviousStep = () => {
    if (activeTab === 'step3') setActiveTab('step2');
    else if (activeTab === 'step2') setActiveTab('step1');
  };

  const handleSubmit = async () => {
    if (!formState.quoteDetails) return Promise.reject(new Error("Quote details not available"));

    const quoteData = {
      vehicle_id: formState.selectedVehicle,
      departure_location: formState.departureAddress,
      arrival_location: formState.destinationAddress,
      departure_coordinates: formState.departureCoordinates,
      arrival_coordinates: formState.destinationCoordinates,
      distance_km: formState.estimatedDistance,
      duration_minutes: formState.estimatedDuration,
      ride_date: formState.date.toISOString(),
      amount: formState.quoteDetails.totalPrice,
      has_return_trip: formState.hasReturnTrip,
      has_waiting_time: formState.hasWaitingTime,
      waiting_time_minutes: formState.waitingTimeMinutes,
      waiting_time_price: formState.quoteDetails.waitingTimePrice,
      return_to_same_address: formState.returnToSameAddress,
      custom_return_address: formState.customReturnAddress,
      return_coordinates: formState.customReturnCoordinates,
      return_distance_km: formState.returnDistance,
      return_duration_minutes: formState.returnDuration,
      has_night_rate: formState.quoteDetails.isNightRate || false,
      night_hours: formState.quoteDetails.nightHours || 0,
      night_rate_percentage: formState.quoteDetails.nightRatePercentage || 0,
      night_surcharge: formState.quoteDetails.nightSurcharge || 0,
      is_sunday_holiday: formState.quoteDetails.isSunday || false,
      sunday_holiday_percentage: formState.quoteDetails.sundayRate || 0,
      sunday_holiday_surcharge: formState.quoteDetails.sundaySurcharge || 0
    };

    const clientData = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      phone: formState.phone
    };

    return submitQuote(quoteData, clientData);
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <SimulatorHeader />
      
      <div className="mb-6">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Simulateur de tarification</AlertTitle>
          <AlertDescription className="text-blue-700">
            Ce simulateur vous permet d'obtenir un devis instantané pour votre trajet. 
            Les tarifs affichés incluent toutes les charges, y compris les majorations pour les trajets de nuit 
            et les dimanches/jours fériés le cas échéant.
          </AlertDescription>
        </Alert>
      </div>
      
      {!simulatorReady ? (
        <SimulatorLoading />
      ) : isQuoteSent ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Devis envoyé avec succès</CardTitle>
            <CardDescription className="text-green-700">
              Votre demande de devis a été envoyée. Vous recevrez une confirmation par email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700">
              Merci d'avoir utilisé notre simulateur de tarification. Notre équipe va traiter votre demande dans les plus brefs délais.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">
              Créer un nouveau devis
            </Button>
            <Button onClick={navigateToDashboard} className="w-full sm:w-auto">
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <SimulatorTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formState={formState}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        </div>
      )}
    </div>
  );
};

export default SimulatorContainer;
