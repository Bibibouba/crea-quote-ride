
import React, { useState, useEffect } from 'react';
import { useMapbox } from '@/hooks/useMapbox';
import { useToast } from '@/hooks/use-toast';
import MapTokenInput from './MapTokenInput';
import RouteMapDisplay from './RouteMapDisplay';

interface RouteMapProps {
  departure?: [number, number];
  destination?: [number, number];
  className?: string;
  onRouteCalculated?: (distance: number, duration: number) => void;
  returnDestination?: [number, number]; // Nouvelle prop pour l'adresse de retour
  onReturnRouteCalculated?: (distance: number, duration: number) => void; // Callback pour le trajet retour
  showReturn?: boolean; // Indique si on doit afficher le trajet retour
}

const RouteMap: React.FC<RouteMapProps> = ({
  departure,
  destination,
  className,
  onRouteCalculated,
  returnDestination,
  onReturnRouteCalculated,
  showReturn = false
}) => {
  const { mapboxToken, setToken, error: mapboxError } = useMapbox();
  const { toast } = useToast();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInputValue, setTokenInputValue] = useState('');
  const [mapError, setMapError] = useState<string | null>(null);

  // Check if token is available
  useEffect(() => {
    if (!mapboxToken) {
      setShowTokenInput(true);
    } else {
      setShowTokenInput(false);
    }
  }, [mapboxToken]);

  // Handle Mapbox errors
  useEffect(() => {
    if (mapboxError) {
      setMapError(mapboxError);
      setShowTokenInput(true);
      toast({
        title: 'Erreur Mapbox',
        description: mapboxError,
        variant: 'destructive'
      });
    }
  }, [mapboxError, toast]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInputValue.trim()) {
      setToken(tokenInputValue.trim());
      setShowTokenInput(false);
      setMapError(null);
    } else {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un token Mapbox valide',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className={`relative w-full h-96 rounded-lg overflow-hidden border ${className}`}>
      {showTokenInput ? (
        <MapTokenInput 
          tokenInputValue={tokenInputValue}
          setTokenInputValue={setTokenInputValue}
          onSubmit={handleTokenSubmit}
          error={mapError}
        />
      ) : (
        <RouteMapDisplay
          mapboxToken={mapboxToken || ''}
          departure={departure}
          destination={destination}
          onRouteCalculated={onRouteCalculated}
          returnDestination={returnDestination}
          onReturnRouteCalculated={onReturnRouteCalculated}
          showReturn={showReturn}
        />
      )}
    </div>
  );
};

export default RouteMap;
