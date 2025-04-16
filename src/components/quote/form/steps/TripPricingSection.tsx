
import React from 'react';
import { TripDetailsDisplay } from './TripDetailsDisplay';
import { PriceDetailsDisplay } from './PriceDetailsDisplay';

interface TripPricingSectionProps {
  estimatedDistance: number;
  estimatedDuration: number;
  time: string;
  hasMinDistanceWarning: boolean;
  minDistance: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  quoteDetails: any;
  isNightRate: boolean;
  isSunday: boolean;
  nightHours: number;
}

export const TripPricingSection: React.FC<TripPricingSectionProps> = (props) => {
  const {
    estimatedDistance,
    estimatedDuration,
    time,
    hasMinDistanceWarning,
    minDistance,
    hasReturnTrip,
    returnToSameAddress,
    returnDistance,
    returnDuration,
    hasWaitingTime,
    waitingTimeMinutes,
    quoteDetails,
    isNightRate,
    isSunday,
    nightHours
  } = props;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-medium mb-3">Détails du trajet</h3>
        
        <TripDetailsDisplay
          estimatedDistance={estimatedDistance}
          estimatedDuration={estimatedDuration}
          time={time}
          hasMinDistanceWarning={hasMinDistanceWarning}
          minDistance={minDistance}
          hasReturnTrip={hasReturnTrip}
          returnToSameAddress={returnToSameAddress}
          returnDistance={returnDistance}
          returnDuration={returnDuration}
        />
      </div>
      
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-medium mb-3">Détails du prix</h3>
        
        <PriceDetailsDisplay
          quoteDetails={quoteDetails}
          hasWaitingTime={hasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          hasReturnTrip={hasReturnTrip}
          returnToSameAddress={returnToSameAddress}
          estimatedDistance={estimatedDistance}
          returnDistance={returnDistance}
          isNightRate={isNightRate}
          isSunday={isSunday}
          nightHours={nightHours}
        />
      </div>
    </div>
  );
};
