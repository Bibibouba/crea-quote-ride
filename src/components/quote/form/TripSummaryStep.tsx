import React from 'react';
import { TripHeaderCard } from './steps/TripHeaderCard';
import { TripSummaryHeader } from './summary/trip-summary/TripSummaryHeader';
import { TripTimingDetails } from './summary/trip-details/TripTimingDetails';
import { RouteDetailsSection } from './steps/RouteDetailsSection';
import { TripPricingSection } from './steps/TripPricingSection';
import { TripSummaryActions } from './summary/trip-summary/TripSummaryActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TripDetailsDisplay } from './steps/TripDetailsDisplay';

interface TripSummaryStepProps {
  departureAddress: string;
  destinationAddress: string;
  customReturnAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date?: Date;
  time: string;
  selectedVehicle: string;
  passengers: string;
  estimatedDistance: number;
  estimatedDuration: number;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  returnToSameAddress: boolean;
  returnDistance: number;
  returnDuration: number;
  customReturnCoordinates?: [number, number];
  quoteDetails: any;
  vehicles: any[];
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleReturnRouteCalculated?: (distance: number, duration: number) => void;
}

const TripSummaryStep: React.FC<TripSummaryStepProps> = (props) => {
  const {
    departureAddress,
    destinationAddress,
    customReturnAddress,
    date,
    time,
    selectedVehicle,
    passengers,
    estimatedDistance,
    estimatedDuration,
    hasReturnTrip,
    hasWaitingTime,
    waitingTimeMinutes,
    returnToSameAddress,
    returnDistance,
    returnDuration,
    departureCoordinates,
    destinationCoordinates,
    customReturnCoordinates,
    quoteDetails,
    vehicles,
    handleRouteCalculated,
    handleNextStep,
    handlePreviousStep,
    handleReturnRouteCalculated
  } = props;

  const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
  const hasMinDistanceWarning = quoteDetails?.hasMinDistanceWarning;
  const minDistance = quoteDetails?.minDistance || 0;

  return (
    <div className="space-y-6">
      <TripHeaderCard
        departureAddress={departureAddress}
        destinationAddress={destinationAddress}
        customReturnAddress={customReturnAddress}
        hasReturnTrip={hasReturnTrip}
        returnToSameAddress={returnToSameAddress}
        date={date}
        time={time}
        selectedVehicleInfo={selectedVehicleInfo}
        passengers={passengers}
        hasWaitingTime={hasWaitingTime}
        waitingTimeMinutes={waitingTimeMinutes}
      />

      <TripSummaryHeader
        hasMinDistanceWarning={hasMinDistanceWarning}
        estimatedDistance={estimatedDistance}
        minDistance={minDistance}
      />

      <TripTimingDetails
        time={time}
        date={date}
        estimatedDuration={estimatedDuration}
        hasWaitingTime={hasWaitingTime}
        waitingTimeMinutes={waitingTimeMinutes}
        hasReturnTrip={hasReturnTrip}
        returnDuration={returnDuration}
        quoteDetails={quoteDetails}
      />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <RouteDetailsSection
            departureCoordinates={departureCoordinates}
            destinationCoordinates={destinationCoordinates}
            customReturnCoordinates={customReturnCoordinates}
            handleRouteCalculated={handleRouteCalculated}
            handleReturnRouteCalculated={handleReturnRouteCalculated}
            hasReturnTrip={hasReturnTrip}
            returnToSameAddress={returnToSameAddress}
          />
        </div>

        <div className="col-span-2">
          <TripPricingSection
            estimatedDistance={estimatedDistance}
            estimatedDuration={estimatedDuration}
            time={time}
            hasMinDistanceWarning={hasMinDistanceWarning}
            minDistance={minDistance}
            hasReturnTrip={hasReturnTrip}
            returnToSameAddress={returnToSameAddress}
            returnDistance={returnDistance}
            returnDuration={returnDuration}
            hasWaitingTime={hasWaitingTime}
            waitingTimeMinutes={waitingTimeMinutes}
            quoteDetails={quoteDetails}
            isNightRate={quoteDetails?.isNightRate}
            isSunday={quoteDetails?.isSunday}
            nightHours={quoteDetails?.nightHours}
            defaultExpanded={true}
          />
        </div>
      </div>

      <TripSummaryActions
        handlePreviousStep={handlePreviousStep}
        handleNextStep={handleNextStep}
      />
    </div>
  );
};

export default TripSummaryStep;
