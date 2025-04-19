
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
    
    // If returnToSameAddress is true, we don't need customReturnCoordinates
    // If returnToSameAddress is false, we need customReturnCoordinates
    const returnEndPoint = !returnToSameAddress ? 
      customReturnCoordinates : // For custom return address
      undefined; // Will be handled by doubling the initial route
      
    if (!returnToSameAddress && !returnEndPoint) {
      console.log('No custom return coordinates provided for a custom return address');
      return;
    }
    
    if (!returnToSameAddress && returnEndPoint) {
      try {
        console.log('Calculating return route from', destinationCoordinates, 'to', returnEndPoint);
        const route = await getRoute(destinationCoordinates, returnEndPoint);
        if (route) {
          console.log('Return route calculated:', route.distance, 'km', route.duration, 'min');
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
    if (hasReturnTrip && destinationCoordinates) {
      if (returnToSameAddress) {
        // For same address return, simply double the initial route
        setReturnDistance(totalDistance);
        setReturnDuration(totalDuration);
      } else {
        // For custom return address, calculate a new route
        calculateReturnRoute();
      }
    } else {
      setReturnDistance(0);
      setReturnDuration(0);
    }
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, calculateReturnRoute, totalDistance, totalDuration]);
  
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
  
  // Add a handler for return route calculations from the map component
  const handleReturnRouteCalculated = useCallback((distance: number, duration: number) => {
    if (!hasReturnTrip) return;
    
    const roundedDistance = Math.round(distance);
    const roundedDuration = Math.round(duration);
    
    console.log('Setting return distance and duration:', roundedDistance, roundedDuration);
    setReturnDistance(roundedDistance);
    setReturnDuration(roundedDuration);
    
    // Update total distance and duration
    if (totalDistance > 0) {
      const oneWayDistance = totalDistance - returnDistance;
      setTotalDistance(oneWayDistance + roundedDistance);
      
      const oneWayDuration = totalDuration - returnDuration;
      setTotalDuration(oneWayDuration + roundedDuration);
    }
  }, [hasReturnTrip, totalDistance, totalDuration, returnDistance, returnDuration]);
  
  return {
    returnDistance,
    returnDuration,
    totalDistance,
    totalDuration,
    handleRouteCalculated,
    handleReturnRouteCalculated
  };
};
