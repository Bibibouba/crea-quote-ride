
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuoteForm } from '@/hooks/useQuoteForm';
import TripInfoStep from '@/components/quote/form/TripInfoStep';
import TripSummaryStep from '@/components/quote/form/TripSummaryStep';
import ClientInfoStep from '@/components/quote/form/ClientInfoStep';
import SuccessMessageStep from '@/components/quote/form/SuccessMessageStep';

const ClientSimulator = () => {
  const {
    activeTab,
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    destinationCoordinates,
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
    estimatedDistance,
    estimatedDuration,
    price,
    quoteDetails,
    isSubmitting,
    isQuoteSent,
    
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
    
    vehiclesLoading,
    pricingLoading,
    vehicles,
    
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    resetForm,
    navigate
  } = useQuoteForm();
  
  if (vehiclesLoading || pricingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement des données...</p>
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
              navigateToDashboard={() => navigate('/dashboard/quotes')}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                  lastName={lastName}
                  setLastName={setLastName}
                  email={email}
                  setEmail={setEmail}
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
