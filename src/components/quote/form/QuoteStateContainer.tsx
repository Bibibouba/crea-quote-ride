
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import QuoteRequestForm from './QuoteRequestForm';
import QuoteDisplay from './QuoteDisplay';
import SuccessMessage from './SuccessMessage';
import { UseQuoteFormStateProps, useQuoteFormState } from '@/hooks/useQuoteFormState';

interface QuoteStateContainerProps extends UseQuoteFormStateProps {
  showDashboardLink?: boolean;
}

const QuoteStateContainer: React.FC<QuoteStateContainerProps> = ({ 
  clientId, 
  onSuccess, 
  showDashboardLink = true 
}) => {
  const formState = useQuoteFormState({ clientId, onSuccess });

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
    showQuote,
    isLoading,
    isSubmitting,
    isQuoteSent,
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
    returnDistance,
    returnDuration,
    customReturnCoordinates,
    vehicles,
    basePrice,
    estimatedPrice,
    waitingTimeOptions,
    handleSubmit,
    handleReturnAddressSelect,
    handleSaveQuote,
    handleRouteCalculated,
    handleReturnRouteCalculated,
    handleReset,
    oneWayDistance,
    oneWayDuration,
    totalDuration
  } = formState;
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {!showQuote ? (
        <QuoteRequestForm
          departureAddress={departureAddress}
          setDepartureAddress={setDepartureAddress}
          destinationAddress={destinationAddress}
          setDestinationAddress={setDestinationAddress}
          departureCoordinates={departureCoordinates}
          setDepartureCoordinates={setDepartureCoordinates}
          destinationCoordinates={destinationCoordinates}
          setDestinationCoordinates={setDestinationCoordinates}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          passengers={passengers}
          setPassengers={setPassengers}
          estimatedDistance={oneWayDistance}
          estimatedDuration={oneWayDuration}
          onRouteCalculated={handleRouteCalculated}
          onReturnRouteCalculated={handleReturnRouteCalculated}
          vehicles={vehicles}
          hasReturnTrip={hasReturnTrip}
          setHasReturnTrip={setHasReturnTrip}
          hasWaitingTime={hasWaitingTime}
          setHasWaitingTime={setHasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          setWaitingTimeMinutes={setWaitingTimeMinutes}
          waitingTimePrice={waitingTimePrice}
          waitingTimeOptions={waitingTimeOptions}
          returnToSameAddress={returnToSameAddress}
          setReturnToSameAddress={setReturnToSameAddress}
          customReturnAddress={customReturnAddress}
          setCustomReturnAddress={setCustomReturnAddress}
          handleReturnAddressSelect={handleReturnAddressSelect}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          returnDistance={returnDistance}
          returnDuration={returnDuration}
          customReturnCoordinates={customReturnCoordinates}
          totalDuration={totalDuration}
        />
      ) : isQuoteSent ? (
        <Card>
          <CardContent className="pt-6">
            <SuccessMessage 
              onCreateNew={handleReset} 
              showDashboardLink={showDashboardLink}
            />
          </CardContent>
        </Card>
      ) : (
        <QuoteDisplay
          departureAddress={departureAddress}
          destinationAddress={destinationAddress}
          departureCoordinates={departureCoordinates}
          destinationCoordinates={destinationCoordinates}
          date={date}
          time={time}
          estimatedDistance={oneWayDistance}
          estimatedDuration={oneWayDuration}
          selectedVehicle={selectedVehicle}
          passengers={passengers}
          basePrice={basePrice}
          estimatedPrice={estimatedPrice}
          isSubmitting={isSubmitting}
          onSaveQuote={handleSaveQuote}
          onEditQuote={() => formState.setShowQuote(false)}
          clientId={clientId}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          vehicles={vehicles}
          hasReturnTrip={hasReturnTrip}
          hasWaitingTime={hasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          waitingTimePrice={waitingTimePrice}
          returnToSameAddress={returnToSameAddress}
          customReturnAddress={customReturnAddress}
          returnDistance={returnDistance}
          returnDuration={returnDuration}
          returnCoordinates={customReturnCoordinates}
          totalDuration={totalDuration}
        />
      )}
    </div>
  );
};

export default QuoteStateContainer;
