import React from 'react';
import { TripHeaderCard } from './steps/TripHeaderCard';
import { MinDistanceAlert } from './summary/MinDistanceAlert';
import { TripTimeInfo } from './summary/TripTimeInfo';
import { TripDetailsGrid } from './summary/TripDetailsGrid';
import { FormNavigation } from './summary/FormNavigation';

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
  const selectedVehicleInfo = props.vehicles.find(v => v.id === props.selectedVehicle);
  const hasMinDistanceWarning = props.quoteDetails?.hasMinDistanceWarning;
  const minDistance = props.quoteDetails?.minDistance || 0;
  
  const tripEndTime = (() => {
    const [hours, minutes] = props.time.split(':').map(Number);
    const arrivalTime = new Date();
    arrivalTime.setHours(hours);
    arrivalTime.setMinutes(minutes + props.estimatedDuration);
    return arrivalTime;
  })();

  return (
    <div className="space-y-6">
      <TripHeaderCard
        departureAddress={props.departureAddress}
        destinationAddress={props.destinationAddress}
        customReturnAddress={props.customReturnAddress}
        hasReturnTrip={props.hasReturnTrip}
        returnToSameAddress={props.returnToSameAddress}
        date={props.date}
        time={props.time}
        selectedVehicleInfo={selectedVehicleInfo}
        passengers={props.passengers}
        hasWaitingTime={props.hasWaitingTime}
        waitingTimeMinutes={props.waitingTimeMinutes}
      />
      
      {hasMinDistanceWarning && (
        <MinDistanceAlert 
          estimatedDistance={props.estimatedDistance}
          minDistance={minDistance}
        />
      )}
      
      <TripTimeInfo
        startTime={props.time}
        endTime={
          tripEndTime.getHours().toString().padStart(2, '0') + ':' + 
          tripEndTime.getMinutes().toString().padStart(2, '0')
        }
        nightRateInfo={props.quoteDetails?.nightRateInfo}
        returnNightRateInfo={props.quoteDetails?.returnNightRateInfo}
        sundayRateInfo={props.quoteDetails?.sundayRateInfo}
        hasReturnTrip={props.hasReturnTrip}
      />
      
      <TripDetailsGrid
        {...props}
        isNightRate={!!props.quoteDetails?.isNightRate}
        isSunday={!!props.quoteDetails?.isSunday}
        nightHours={props.quoteDetails?.nightHours || 0}
      />
      
      <FormNavigation
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={props.handleNextStep}
      />
    </div>
  );
};

export default TripSummaryStep;
