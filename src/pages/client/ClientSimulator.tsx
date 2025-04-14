
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuoteForm } from '@/hooks/useQuoteForm';
import TripInfoStep from '@/components/quote/form/TripInfoStep';
import TripSummaryStep from '@/components/quote/form/TripSummaryStep';
import ClientInfoStep from '@/components/quote/form/ClientInfoStep';
import SuccessMessageStep from '@/components/quote/form/SuccessMessageStep';
import { useClientSimulator } from '@/hooks/useClientSimulator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ClientSimulator = () => {
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
  
  const {
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
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    estimatedDistance,
    estimatedDuration,
    quoteDetails,
    
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
    returnDistance,
    returnDuration,
    waitingTimeOptions,
    
    vehicles,
    isLoadingVehicles,
    
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated
  } = useQuoteForm();
  
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
      departure_location: departureAddress,
      arrival_location: destinationAddress,
      departure_coordinates: departureCoordinates,
      arrival_coordinates: destinationCoordinates,
      distance_km: estimatedDistance,
      duration_minutes: estimatedDuration,
      ride_date: new Date(date).toISOString(),
      amount: quoteDetails?.totalPrice || 0,
      vehicle_id: selectedVehicle,
      has_return_trip: hasReturnTrip,
      has_waiting_time: hasWaitingTime,
      waiting_time_minutes: hasWaitingTime ? waitingTimeMinutes : 0,
      waiting_time_price: hasWaitingTime ? waitingTimePrice : 0,
      return_to_same_address: returnToSameAddress,
      custom_return_address: customReturnAddress,
      return_coordinates: customReturnCoordinates,
      return_distance_km: returnDistance,
      return_duration_minutes: returnDuration
    };
    
    // Préparer les données du client
    const clientData = {
      firstName,
      lastName,
      email,
      phone
    };
    
    // Soumettre le devis
    await submitQuote(quoteData, clientData);
  };
  
  if (isAuthChecking || isLoadingVehicles) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Chargement des données...
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Simulateur d'interface client</CardTitle>
          <CardDescription>
            Visualisez ce que vos clients verront lors d'une demande de devis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isQuoteSent ? (
            <SuccessMessageStep 
              email={email}
              resetForm={resetForm}
              navigateToDashboard={navigateToDashboard}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'step1' | 'step2' | 'step3')} className="space-y-6">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="step1">
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background">
                      1
                    </span>
                    Informations du trajet
                  </span>
                </TabsTrigger>
                <TabsTrigger value="step2">
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background">
                      2
                    </span>
                    Calcul du trajet
                  </span>
                </TabsTrigger>
                <TabsTrigger value="step3">
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background">
                      3
                    </span>
                    Informations client
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="step1">
                <TripInfoStep
                  departureAddress={departureAddress}
                  setDepartureAddress={setDepartureAddress}
                  destinationAddress={destinationAddress}
                  setDestinationAddress={setDestinationAddress}
                  departureCoordinates={departureCoordinates}
                  destinationCoordinates={destinationCoordinates}
                  date={date}
                  setDate={setDate}
                  time={time}
                  setTime={setTime}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  estimatedDistance={estimatedDistance}
                  estimatedDuration={estimatedDuration}
                  hasReturnTrip={hasReturnTrip}
                  setHasReturnTrip={setHasReturnTrip}
                  hasWaitingTime={hasWaitingTime}
                  setHasWaitingTime={setHasWaitingTime}
                  waitingTimeMinutes={waitingTimeMinutes}
                  setWaitingTimeMinutes={setWaitingTimeMinutes}
                  waitingTimePrice={waitingTimePrice}
                  returnToSameAddress={returnToSameAddress}
                  setReturnToSameAddress={setReturnToSameAddress}
                  customReturnAddress={customReturnAddress}
                  setCustomReturnAddress={setCustomReturnAddress}
                  waitingTimeOptions={waitingTimeOptions}
                  vehicles={vehicles}
                  handleDepartureSelect={handleDepartureSelect}
                  handleDestinationSelect={handleDestinationSelect}
                  handleReturnAddressSelect={handleReturnAddressSelect}
                  handleRouteCalculated={handleRouteCalculated}
                  handleNextStep={handleNextStep}
                />
              </TabsContent>
              
              <TabsContent value="step2">
                <TripSummaryStep
                  departureAddress={departureAddress}
                  destinationAddress={destinationAddress}
                  customReturnAddress={customReturnAddress}
                  departureCoordinates={departureCoordinates}
                  destinationCoordinates={destinationCoordinates}
                  date={date}
                  time={time}
                  selectedVehicle={selectedVehicle}
                  passengers={passengers}
                  estimatedDistance={estimatedDistance}
                  estimatedDuration={estimatedDuration}
                  hasReturnTrip={hasReturnTrip}
                  hasWaitingTime={hasWaitingTime}
                  waitingTimeMinutes={waitingTimeMinutes}
                  returnToSameAddress={returnToSameAddress}
                  returnDistance={returnDistance}
                  returnDuration={returnDuration}
                  customReturnCoordinates={customReturnCoordinates}
                  quoteDetails={quoteDetails}
                  vehicles={vehicles}
                  handleRouteCalculated={handleRouteCalculated}
                  handleNextStep={handleNextStep}
                  handlePreviousStep={handlePreviousStep}
                />
              </TabsContent>
              
              <TabsContent value="step3">
                <ClientInfoStep
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={setLastName}
                  setLastName={setLastName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  handlePreviousStep={handlePreviousStep}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSimulator;
