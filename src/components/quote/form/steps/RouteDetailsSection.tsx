
import React from 'react';
import RouteMap from '@/components/map/RouteMap';

interface RouteDetailsSectionProps {
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  customReturnCoordinates?: [number, number];
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleReturnRouteCalculated?: (distance: number, duration: number) => void;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
}

export const RouteDetailsSection: React.FC<RouteDetailsSectionProps> = ({
  departureCoordinates,
  destinationCoordinates,
  customReturnCoordinates,
  handleRouteCalculated,
  handleReturnRouteCalculated,
  hasReturnTrip,
  returnToSameAddress
}) => {
  return (
    <div className="h-[400px] rounded-lg border overflow-hidden">
      {departureCoordinates && destinationCoordinates ? (
        <RouteMap
          departure={departureCoordinates}
          destination={destinationCoordinates}
          onRouteCalculated={handleRouteCalculated}
          returnDestination={!returnToSameAddress ? customReturnCoordinates : undefined}
          onReturnRouteCalculated={handleReturnRouteCalculated}
          showReturn={hasReturnTrip}
        />
      ) : (
        <div className="flex flex-col h-full items-center justify-center p-4 bg-muted">
          <p className="text-sm text-muted-foreground mb-1">Carte du trajet</p>
          <p className="text-xs">Sélectionnez des adresses valides pour afficher l'itinéraire</p>
        </div>
      )}
    </div>
  );
};
