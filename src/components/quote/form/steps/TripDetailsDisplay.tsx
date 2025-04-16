
import React from 'react';
import { formatDuration } from '@/lib/formatDuration';
import { format } from 'date-fns';

interface TripDetailsDisplayProps {
  estimatedDistance: number;
  estimatedDuration: number;
  time: string;
  hasMinDistanceWarning: boolean;
  minDistance: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  returnDistance: number;
  returnDuration: number;
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
  returnDuration
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm">Distance estimée (aller)</p>
        <p className="text-sm font-medium">
          {estimatedDistance} km
          {hasMinDistanceWarning && (
            <span className="text-xs text-amber-600 ml-1">
              (min. {minDistance} km)
            </span>
          )}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">Durée estimée (aller)</p>
        <p className="text-sm font-medium">{formatDuration(estimatedDuration)}</p>
      </div>
      
      {hasReturnTrip && !returnToSameAddress && (
        <>
          <div className="flex justify-between">
            <p className="text-sm">Distance estimée (retour)</p>
            <p className="text-sm font-medium">
              {returnDistance} km
              {hasMinDistanceWarning && returnDistance < minDistance && (
                <span className="text-xs text-amber-600 ml-1">
                  (min. {minDistance} km)
                </span>
              )}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Durée estimée (retour)</p>
            <p className="text-sm font-medium">{formatDuration(returnDuration)}</p>
          </div>
        </>
      )}
      
      <div className="flex justify-between">
        <p className="text-sm">Heure d'arrivée estimée</p>
        <p className="text-sm font-medium">
          {time ? (
            (() => {
              const [hours, minutes] = time.split(':').map(Number);
              const arrivalTime = new Date();
              arrivalTime.setHours(hours);
              arrivalTime.setMinutes(minutes + estimatedDuration);
              return format(arrivalTime, 'HH:mm');
            })()
          ) : "Non spécifiée"}
        </p>
      </div>
    </div>
  );
};
