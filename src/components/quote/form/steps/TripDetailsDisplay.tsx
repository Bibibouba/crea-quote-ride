
import React from 'react';
import { formatDuration } from '@/lib/formatDuration';
import { OutboundTripDetails } from '../trip/OutboundTripDetails';
import { ReturnTripDetails } from '../trip/ReturnTripDetails';

export interface TripDetailsDisplayProps {
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
}

export const TripDetailsDisplay: React.FC<TripDetailsDisplayProps> = ({
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
}) => {
  const totalDistance = hasReturnTrip 
    ? (returnToSameAddress ? estimatedDistance * 2 : estimatedDistance + returnDistance)
    : estimatedDistance;

  const totalDuration = hasReturnTrip
    ? (returnToSameAddress ? estimatedDuration * 2 : estimatedDuration + returnDuration)
    : estimatedDuration;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Heure de prise en charge</p>
          <p className="text-2xl font-semibold">{time}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Distance totale</p>
          <p className="text-2xl font-semibold">{totalDistance} km</p>
        </div>
        <div>
          <p className="text-sm font-medium">Durée estimée</p>
          <p className="text-2xl font-semibold">{formatDuration(totalDuration)}</p>
        </div>
      </div>

      {hasReturnTrip && (
        <div className="grid grid-cols-2 gap-4 border-t pt-3 mt-2">
          <OutboundTripDetails 
            distance={estimatedDistance}
            duration={estimatedDuration}
          />
          <ReturnTripDetails
            enabled={hasReturnTrip}
            distance={returnToSameAddress ? estimatedDistance : returnDistance}
            duration={returnToSameAddress ? estimatedDuration : returnDuration}
            returnToSameAddress={returnToSameAddress}
          />
        </div>
      )}

      {hasWaitingTime && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Temps d'attente : {waitingTimeMinutes} minutes
          </p>
        </div>
      )}

      {hasMinDistanceWarning && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            La distance minimale pour ce type de véhicule est de {minDistance} km.
            Le prix sera calculé sur cette base.
          </p>
        </div>
      )}
    </div>
  );
};
