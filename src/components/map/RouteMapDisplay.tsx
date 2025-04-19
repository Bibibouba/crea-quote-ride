
import React, { useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapInitialization } from '@/hooks/map/useMapInitialization';
import { useRouteMarkers } from '@/hooks/map/useRouteMarkers';

interface RouteMapDisplayProps {
  mapboxToken: string;
  departure?: [number, number];
  destination?: [number, number];
  onRouteCalculated?: (distance: number, duration: number) => void;
  returnDestination?: [number, number];
  onReturnRouteCalculated?: (distance: number, duration: number) => void;
  showReturn?: boolean;
}

const RouteMapDisplay: React.FC<RouteMapDisplayProps> = ({
  mapboxToken,
  departure,
  destination,
  onRouteCalculated,
  returnDestination,
  onReturnRouteCalculated,
  showReturn = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useMapInitialization({ mapboxToken, container: mapContainer });

  useRouteMarkers({
    map,
    departure,
    destination,
    returnDestination,
    showReturn,
    onRouteCalculated,
    onReturnRouteCalculated,
    mapboxToken
  });

  return <div ref={mapContainer} className="absolute inset-0" />;
};

export default RouteMapDisplay;
