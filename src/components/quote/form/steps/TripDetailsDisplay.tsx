
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
  waitingTimeMinutes
}) => {
  // Calculate the total distance (one-way + return if applicable)
  const totalDistance = hasReturnTrip 
    ? estimatedDistance + returnDistance
    : estimatedDistance;
  
  // Calculate the total duration (one-way + waiting time + return if applicable)
  const waitingDuration = hasWaitingTime ? waitingTimeMinutes : 0;
  const totalDuration = hasReturnTrip 
    ? estimatedDuration + waitingDuration + returnDuration
    : estimatedDuration;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p className="text-sm">Distance estimée (totale)</p>
        <p className="text-sm font-medium">
          {totalDistance} km
          {hasMinDistanceWarning && (
            <span className="text-xs text-amber-600 ml-1">
              (min. {minDistance} km)
            </span>
          )}
        </p>
      </div>
      
      {hasReturnTrip && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">  - Distance aller</p>
          <p className="text-sm text-muted-foreground">{estimatedDistance} km</p>
        </div>
      )}
      
      {hasReturnTrip && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">  - Distance retour</p>
          <p className="text-sm text-muted-foreground">{returnDistance} km</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <p className="text-sm">Durée estimée (totale)</p>
        <p className="text-sm font-medium">{formatDuration(totalDuration)}</p>
      </div>
      
      {hasReturnTrip && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">  - Durée aller</p>
          <p className="text-sm text-muted-foreground">{formatDuration(estimatedDuration)}</p>
        </div>
      )}
      
      {hasWaitingTime && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">  - Temps d'attente</p>
          <p className="text-sm text-muted-foreground">{formatDuration(waitingDuration)}</p>
        </div>
      )}
      
      {hasReturnTrip && (
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">  - Durée retour</p>
          <p className="text-sm text-muted-foreground">{formatDuration(returnDuration)}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <p className="text-sm">Heure d'arrivée estimée</p>
        <p className="text-sm font-medium">
          {time ? (
            (() => {
              const [hours, minutes] = time.split(':').map(Number);
              const arrivalTime = new Date();
              arrivalTime.setHours(hours);
              arrivalTime.setMinutes(minutes + totalDuration);
              return format(arrivalTime, 'HH:mm');
            })()
          ) : "Non spécifiée"}
        </p>
      </div>
    </div>
  );
};
