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
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  isNightRate: boolean;
  isSunday: boolean;
  nightHours: number;
}

export const TripDetailsDisplay: React.FC<TripDetailsDisplayProps> = ({
  estimatedDistance,
  estimatedDuration,
  time,
  hasMinDistanceWarning,
  minDistance,
  hasReturnTrip,
  returnDistance,
  returnDuration,
  hasWaitingTime,
  waitingTimeMinutes,
  isNightRate,
  isSunday,
  nightHours,
}) => {
  // Calcul de la distance totale (aller + retour)
  const totalDistance =
    estimatedDistance + (hasReturnTrip ? returnDistance : 0);

  // Calcul de la durée totale en minutes (aller + retour + attente)
  const totalDuration =
    estimatedDuration +
    (hasReturnTrip ? returnDuration : 0) +
    (hasWaitingTime ? waitingTimeMinutes : 0);

  return (
    <div className="space-y-2">
      {/* Distance totale */}
      <div className="flex justify-between">
        <p className="text-sm">Distance estimée (totale)</p>
        <p className="text-sm font-medium">
          {totalDistance} km
          {hasMinDistanceWarning && (
            <span className="text-xs text-amber-600 ml-1">
              (min. {minDistance} km)
            </span>
          )}
        </p>
      </div>

      {/* Détails des segments */}
      {hasReturnTrip && (
        <>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">  - Distance aller</p>
            <p className="text-sm text-muted-foreground">{estimatedDistance} km</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">  - Distance retour</p>
            <p className="text-sm text-muted-foreground">{returnDistance} km</p>
          </div>
        </>
      )}

      {/* Durée totale */}
      <div className="flex justify-between">
        <p className="text-sm">Durée estimée (totale)</p>
        <p className="text-sm font-medium">{formatDuration(totalDuration)}</p>
      </div>

      {/* Détails des temps */}
      <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <p>  - Durée aller</p>
          <p>{formatDuration(estimatedDuration)}</p>
        </div>
        {hasReturnTrip && (
          <div className="flex justify-between">
            <p>  - Durée retour</p>
            <p>{formatDuration(returnDuration)}</p>
          </div>
        )}
        {hasWaitingTime && (
          <div className="flex justify-between">
            <p>  - Temps d'attente</p>
            <p>{formatDuration(waitingTimeMinutes)}</p>
          </div>
        )}
      </div>

      {/* Heure d'arrivée */}
      <div className="flex justify-between">
        <p className="text-sm">Heure d'arrivée estimée</p>
        <p className="text-sm font-medium">
          {(() => {
            const [h, m] = time.split(':').map(Number);
            const arrival = new Date();
            arrival.setHours(h);
            arrival.setMinutes(m + totalDuration);
            return format(arrival, 'HH:mm');
          })()}
        </p>
      </div>

      {/* Conditions spéciales */}
      {(isNightRate || isSunday) && (
        <p className="text-xs text-muted-foreground">
          {isNightRate && `Heures de nuit: ${nightHours}h`} 
          {isSunday && 'Dimanche / Férié'}
        </p>
      )}
    </div>
  );
};
