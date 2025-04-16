
import React from 'react';
import RouteMap from '@/components/map/RouteMap';

interface MapSectionProps {
  departureCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
  returnCoordinates?: [number, number] | undefined;
  hasReturnTrip?: boolean;
  returnToSameAddress?: boolean;
}

export const MapSection: React.FC<MapSectionProps> = ({
  departureCoordinates,
  destinationCoordinates,
  returnCoordinates,
  hasReturnTrip = false,
  returnToSameAddress = true
}) => {
  return (
    <div className="h-[400px] rounded-lg overflow-hidden border">
      <RouteMap
        departure={departureCoordinates}
        destination={destinationCoordinates}
        returnDestination={returnToSameAddress ? undefined : returnCoordinates}
        showReturn={hasReturnTrip}
      />
    </div>
  );
};
