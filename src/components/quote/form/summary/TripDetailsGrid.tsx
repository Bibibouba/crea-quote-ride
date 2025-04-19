
import React from 'react';
import { RouteDetailsSection } from '../steps/RouteDetailsSection';
import { TripPricingSection } from '../steps/TripPricingSection';

interface TripDetailsGridProps {
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  customReturnCoordinates?: [number, number];
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleReturnRouteCalculated?: (distance: number, duration: number) => void;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  estimatedDistance: number;
  estimatedDuration: number;
  time: string;
  hasMinDistanceWarning: boolean;
  minDistance: number;
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  quoteDetails: any;
  isNightRate: boolean;
  isSunday: boolean;
  nightHours: number;
}

export const TripDetailsGrid = (props: TripDetailsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RouteDetailsSection
        departureCoordinates={props.departureCoordinates}
        destinationCoordinates={props.destinationCoordinates}
        customReturnCoordinates={props.customReturnCoordinates}
        handleRouteCalculated={props.handleRouteCalculated}
        handleReturnRouteCalculated={props.handleReturnRouteCalculated}
        hasReturnTrip={props.hasReturnTrip}
        returnToSameAddress={props.returnToSameAddress}
      />
      
      <TripPricingSection
        estimatedDistance={props.estimatedDistance}
        estimatedDuration={props.estimatedDuration}
        time={props.time}
        hasMinDistanceWarning={props.hasMinDistanceWarning}
        minDistance={props.minDistance}
        hasReturnTrip={props.hasReturnTrip}
        returnToSameAddress={props.returnToSameAddress}
        returnDistance={props.returnDistance}
        returnDuration={props.returnDuration}
        hasWaitingTime={props.hasWaitingTime}
        waitingTimeMinutes={props.waitingTimeMinutes}
        quoteDetails={props.quoteDetails}
        isNightRate={props.isNightRate}
        isSunday={props.isSunday}
        nightHours={props.nightHours}
      />
    </div>
  );
};
