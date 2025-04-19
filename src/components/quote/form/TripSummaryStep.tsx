
import React from 'react';
import { TripHeaderCard } from './steps/TripHeaderCard';
import { MinDistanceAlert } from './summary/MinDistanceAlert';
import { TripTimeInfo } from './summary/TripTimeInfo';
import { TripDetailsGrid } from './summary/TripDetailsGrid';
import { FormNavigation } from './summary/FormNavigation';
import { TripTotal } from './summary/TripTotal';
import { DayNightGauge } from './summary/DayNightGauge';

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

  // Calculer la distance et la durée totales
  const totalDistance = props.hasReturnTrip 
    ? props.estimatedDistance + (props.returnToSameAddress ? props.estimatedDistance : props.returnDistance)
    : props.estimatedDistance;
    
  const totalDuration = props.hasReturnTrip 
    ? props.estimatedDuration + (props.returnToSameAddress ? props.estimatedDuration : props.returnDuration) + (props.hasWaitingTime ? props.waitingTimeMinutes : 0)
    : props.estimatedDuration;

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
        endTime={tripEndTime.getHours().toString().padStart(2, '0') + ':' + 
                tripEndTime.getMinutes().toString().padStart(2, '0')}
        nightRateInfo={props.quoteDetails?.nightRateInfo}
        returnNightRateInfo={props.quoteDetails?.returnNightRateInfo}
        sundayRateInfo={props.quoteDetails?.sundayRateInfo}
        hasReturnTrip={props.hasReturnTrip}
        selectedVehicleName={selectedVehicleInfo?.name || "A"}
        hasWaitingTime={props.hasWaitingTime}
        waitingTimeMinutes={props.waitingTimeMinutes}
      />
      
      {props.quoteDetails?.dayPercentage !== undefined && props.quoteDetails?.nightPercentage !== undefined && (
        <div className="bg-secondary/20 p-3 rounded-md">
          <DayNightGauge 
            dayPercentage={props.quoteDetails.dayPercentage}
            nightPercentage={props.quoteDetails.nightPercentage}
            dayKm={props.quoteDetails.dayKm}
            nightKm={props.quoteDetails.nightKm}
          />
        </div>
      )}
      
      <TripTotal 
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        totalPrice={props.quoteDetails?.totalPrice || 0}
      />
      
      <TripDetailsGrid
        departureCoordinates={props.departureCoordinates}
        destinationCoordinates={props.destinationCoordinates}
        customReturnCoordinates={props.customReturnCoordinates}
        handleRouteCalculated={props.handleRouteCalculated}
        handleReturnRouteCalculated={props.handleReturnRouteCalculated}
        hasReturnTrip={props.hasReturnTrip}
        returnToSameAddress={props.returnToSameAddress}
        estimatedDistance={props.estimatedDistance}
        estimatedDuration={props.estimatedDuration}
        time={props.time}
        hasMinDistanceWarning={hasMinDistanceWarning}
        minDistance={minDistance}
        returnDistance={props.returnDistance}
        returnDuration={props.returnDuration}
        hasWaitingTime={props.hasWaitingTime}
        waitingTimeMinutes={props.waitingTimeMinutes}
        quoteDetails={props.quoteDetails}
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
