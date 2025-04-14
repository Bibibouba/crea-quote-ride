
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TripInfoStep from '@/components/quote/form/TripInfoStep';
import TripSummaryStep from '@/components/quote/form/TripSummaryStep';
import ClientInfoStep from '@/components/quote/form/ClientInfoStep';
import { QuoteFormState } from '@/types/quoteForm';

interface SimulatorTabsProps {
  activeTab: 'step1' | 'step2' | 'step3';
  setActiveTab: (tab: 'step1' | 'step2' | 'step3') => void;
  formState: QuoteFormState;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

const SimulatorTabs: React.FC<SimulatorTabsProps> = ({
  activeTab,
  setActiveTab,
  formState,
  isSubmitting,
  handleSubmit,
  handleNextStep,
  handlePreviousStep
}) => {
  return (
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
          departureAddress={formState.departureAddress}
          setDepartureAddress={formState.setDepartureAddress}
          destinationAddress={formState.destinationAddress}
          setDestinationAddress={formState.setDestinationAddress}
          departureCoordinates={formState.departureCoordinates}
          destinationCoordinates={formState.destinationCoordinates}
          date={formState.date}
          setDate={formState.setDate}
          time={formState.time}
          setTime={formState.setTime}
          selectedVehicle={formState.selectedVehicle}
          setSelectedVehicle={formState.setSelectedVehicle}
          passengers={formState.passengers}
          setPassengers={formState.setPassengers}
          estimatedDistance={formState.estimatedDistance}
          estimatedDuration={formState.estimatedDuration}
          hasReturnTrip={formState.hasReturnTrip}
          setHasReturnTrip={formState.setHasReturnTrip}
          hasWaitingTime={formState.hasWaitingTime}
          setHasWaitingTime={formState.setHasWaitingTime}
          waitingTimeMinutes={formState.waitingTimeMinutes}
          setWaitingTimeMinutes={formState.setWaitingTimeMinutes}
          waitingTimePrice={formState.waitingTimePrice}
          returnToSameAddress={formState.returnToSameAddress}
          setReturnToSameAddress={formState.setReturnToSameAddress}
          customReturnAddress={formState.customReturnAddress}
          setCustomReturnAddress={formState.setCustomReturnAddress}
          waitingTimeOptions={formState.waitingTimeOptions}
          vehicles={formState.vehicles}
          handleDepartureSelect={formState.handleDepartureSelect}
          handleDestinationSelect={formState.handleDestinationSelect}
          handleReturnAddressSelect={formState.handleReturnAddressSelect}
          handleRouteCalculated={formState.handleRouteCalculated}
          handleNextStep={handleNextStep}
        />
      </TabsContent>
      
      <TabsContent value="step2">
        <TripSummaryStep
          departureAddress={formState.departureAddress}
          destinationAddress={formState.destinationAddress}
          customReturnAddress={formState.customReturnAddress}
          departureCoordinates={formState.departureCoordinates}
          destinationCoordinates={formState.destinationCoordinates}
          date={formState.date}
          time={formState.time}
          selectedVehicle={formState.selectedVehicle}
          passengers={formState.passengers}
          estimatedDistance={formState.estimatedDistance}
          estimatedDuration={formState.estimatedDuration}
          hasReturnTrip={formState.hasReturnTrip}
          hasWaitingTime={formState.hasWaitingTime}
          waitingTimeMinutes={formState.waitingTimeMinutes}
          returnToSameAddress={formState.returnToSameAddress}
          returnDistance={formState.returnDistance}
          returnDuration={formState.returnDuration}
          customReturnCoordinates={formState.customReturnCoordinates}
          quoteDetails={formState.quoteDetails}
          vehicles={formState.vehicles}
          handleRouteCalculated={formState.handleRouteCalculated}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
        />
      </TabsContent>
      
      <TabsContent value="step3">
        <ClientInfoStep
          firstName={formState.firstName}
          setFirstName={formState.setFirstName}
          lastName={formState.lastName}
          setLastName={formState.setLastName}
          email={formState.email}
          setEmail={formState.setEmail}
          phone={formState.phone}
          setPhone={formState.setPhone}
          isSubmitting={isSubmitting}
          handleSubmit={(e) => {
            e.preventDefault();
            return handleSubmit();
          }}
          handlePreviousStep={handlePreviousStep}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SimulatorTabs;
