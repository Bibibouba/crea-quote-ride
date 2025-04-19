
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDuration } from '@/lib/formatDuration';

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
  hasMinDistanceWarning,
  minDistance,
  hasReturnTrip,
  returnToSameAddress,
  returnDistance,
  returnDuration,
  hasWaitingTime,
  waitingTimeMinutes
}) => {
  // Calcul de la distance totale en considérant les deux itinéraires séparément
  const totalDistance = hasReturnTrip 
    ? (returnToSameAddress ? estimatedDistance * 2 : estimatedDistance + returnDistance)
    : estimatedDistance;

  // Calcul de la durée totale en considérant les deux itinéraires séparément
  const totalDuration = hasReturnTrip
    ? (returnToSameAddress ? estimatedDuration * 2 : estimatedDuration + returnDuration)
    : estimatedDuration;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <p className="text-xs text-muted-foreground">Aller</p>
            <p className="text-sm">{estimatedDistance} km / {formatDuration(estimatedDuration)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Retour</p>
            <p className="text-sm">
              {returnToSameAddress ? estimatedDistance : returnDistance} km / 
              {formatDuration(returnToSameAddress ? estimatedDuration : returnDuration)}
            </p>
          </div>
        </div>
      )}

      {hasMinDistanceWarning && (
        <Alert variant="warning" className="mt-4">
          <AlertDescription>
            La distance minimale pour ce type de véhicule est de {minDistance} km.
            Le prix sera calculé sur cette base.
          </AlertDescription>
        </Alert>
      )}

      {hasWaitingTime && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Temps d'attente: {waitingTimeMinutes} minutes
          </p>
        </div>
      )}
    </div>
  );
};
