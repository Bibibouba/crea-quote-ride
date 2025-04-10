
import React, { useEffect } from 'react';
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
    setActiveTab,
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
  
  useEffect(() => {
    console.log("Current form state:", {
      departureAddress,
      destinationAddress,
      departureCoordinates,
      destinationCoordinates,
      activeTab,
      selectedVehicle,
      time,
      date
    });
  }, [departureAddress, destinationAddress, departureCoordinates, destinationCoordinates, activeTab, selectedVehicle, time, date]);
  
  if (vehiclesLoading || pricingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent">
          <CardTitle className="text-primary">Simulateur d'interface client</CardTitle>
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
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'step1' | 'step2' | 'step3')} className="space-y-6">
              <TabsList className="grid grid-cols-3 mb-8 p-1 bg-muted/60">
                <TabsTrigger 
                  value="step1"
                  className="data-[state=active]:bg-pastelBlue/60 data-[state=active]:text-primary"
                >
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background border-primary/20">
                      1
                    </span>
                    <span className="hidden sm:inline">Informations du trajet</span>
                    <span className="sm:hidden">Trajet</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="step2"
                  className="data-[state=active]:bg-pastelGreen/60 data-[state=active]:text-primary"
                >
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background border-primary/20">
                      2
                    </span>
                    <span className="hidden sm:inline">Calcul du trajet</span>
                    <span className="sm:hidden">Calcul</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="step3"
                  className="data-[state=active]:bg-pastelGray/60 data-[state=active]:text-primary"
                >
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background border-primary/20">
                      3
                    </span>
                    <span className="hidden sm:inline">Informations client</span>
                    <span className="sm:hidden">Client</span>
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="step1" className="animate-fade-in">
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
              
              <TabsContent value="step2" className="animate-fade-in">
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
              
              <TabsContent value="step3" className="animate-fade-in">
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
