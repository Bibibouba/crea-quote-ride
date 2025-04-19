
import { useState, useEffect, useCallback } from 'react';
import { useMapbox } from '@/hooks/useMapbox';

interface UseRouteCalculationProps {
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  destinationCoordinates?: [number, number];
  customReturnCoordinates?: [number, number];
}

export const useRouteCalculation = ({
  hasReturnTrip,
  returnToSameAddress,
  destinationCoordinates,
  customReturnCoordinates,
}: UseRouteCalculationProps) => {
  const { getRoute } = useMapbox();
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  
  // Calculate return route when needed
  const calculateReturnRoute = useCallback(async () => {
    if (!hasReturnTrip || !destinationCoordinates) return;
    
    const returnEndPoint = returnToSameAddress ? customReturnCoordinates : undefined;
    
    if (returnEndPoint) {
      try {
        const route = await getRoute(destinationCoordinates, returnEndPoint);
        if (route) {
          setReturnDistance(Math.round(route.distance));
          setReturnDuration(Math.round(route.duration));
        }
      } catch (error) {
        console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
      }
    }
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, getRoute]);
  
  // Update calculations when return trip settings change
  useEffect(() => {
    calculateReturnRoute();
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, calculateReturnRoute]);
  
  const handleRouteCalculated = useCallback((distance: number, duration: number) => {
    const roundedDistance = Math.round(distance);
    const roundedDuration = Math.round(duration);
    
    let totalDist = roundedDistance;
    let totalDur = roundedDuration;
    
    if (hasReturnTrip) {
      if (returnToSameAddress) {
        totalDist = roundedDistance * 2;
        totalDur = roundedDuration * 2;
      } else if (returnDistance > 0) {
        totalDist = roundedDistance + returnDistance;
        totalDur = roundedDuration + returnDuration;
      }
    }
    
    setTotalDistance(totalDist);
    setTotalDuration(totalDur);
    
    return {
      estimatedDistance: totalDist,
      estimatedDuration: totalDur
    };
  }, [hasReturnTrip, returnToSameAddress, returnDistance, returnDuration]);
  
  return {
    returnDistance,
    returnDuration,
    totalDistance,
    totalDuration,
    handleRouteCalculated
  };
};
