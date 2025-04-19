
import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [oneWayDistance, setOneWayDistance] = useState(0);
  const [oneWayDuration, setOneWayDuration] = useState(0);
  
  // Calculate the total distance by combining one-way and return if applicable
  const totalDistance = useMemo(() => {
    return oneWayDistance + (hasReturnTrip ? returnDistance : 0);
  }, [oneWayDistance, returnDistance, hasReturnTrip]);
  
  // Calculate return route when needed
  const calculateReturnRoute = useCallback(async () => {
    if (!hasReturnTrip || !destinationCoordinates) return;
    
    try {
      let returnEndPoint: [number, number] | undefined;
      
      // Determine the return endpoint
      if (!returnToSameAddress && customReturnCoordinates) {
        // For custom return address
        returnEndPoint = customReturnCoordinates;
      } else {
        // For return to same address as departure
        returnEndPoint = undefined; // This will be handled by doubling the initial route
      }
      
      if (!returnToSameAddress && !returnEndPoint) {
        console.log('No custom return coordinates provided for a custom return address');
        return;
      }
      
      if (!returnToSameAddress && returnEndPoint) {
        console.log('Calculating return route from', destinationCoordinates, 'to', returnEndPoint);
        const route = await getRoute(destinationCoordinates, returnEndPoint);
        if (route) {
          console.log('Return route calculated:', route.distance, 'km', route.duration, 'min');
          setReturnDistance(Math.round(route.distance));
          setReturnDuration(Math.round(route.duration));
        }
      } else if (returnToSameAddress) {
        // For same address return, simply double the initial route
        console.log('Using same distance for return (same address):', oneWayDistance, 'km');
        setReturnDistance(oneWayDistance);
        setReturnDuration(oneWayDuration);
      }
    } catch (error) {
      console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
    }
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, getRoute, oneWayDistance, oneWayDuration]);
  
  // Update calculations when return trip settings change
  useEffect(() => {
    if (hasReturnTrip && destinationCoordinates) {
      calculateReturnRoute();
    } else {
      setReturnDistance(0);
      setReturnDuration(0);
    }
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, calculateReturnRoute]);
  
  // Update total duration when component values change
  const totalDuration = useMemo(() => {
    let duration = oneWayDuration;
    
    if (hasReturnTrip) {
      duration += returnDuration;
    }
    
    return duration;
  }, [oneWayDuration, returnDuration, hasReturnTrip]);
  
  const handleRouteCalculated = useCallback((distance: number, duration: number) => {
    const roundedDistance = Math.round(distance);
    const roundedDuration = Math.round(duration);
    
    console.log('One way route calculated:', roundedDistance, 'km', roundedDuration, 'min');
    setOneWayDistance(roundedDistance);
    setOneWayDuration(roundedDuration);
    
    // If returning to same address, update return distance/duration immediately
    if (hasReturnTrip && returnToSameAddress) {
      console.log('Auto-updating return trip (same address):', roundedDistance, 'km');
      setReturnDistance(roundedDistance);
      setReturnDuration(roundedDuration);
    }
    
    return {
      estimatedDistance: roundedDistance,
      estimatedDuration: roundedDuration
    };
  }, [hasReturnTrip, returnToSameAddress]);
  
  // Add a handler for return route calculations from the map component
  const handleReturnRouteCalculated = useCallback((distance: number, duration: number) => {
    if (!hasReturnTrip) return;
    
    const roundedDistance = Math.round(distance);
    const roundedDuration = Math.round(duration);
    
    console.log('Return route explicitly calculated:', roundedDistance, 'km', roundedDuration, 'min');
    setReturnDistance(roundedDistance);
    setReturnDuration(roundedDuration);
  }, [hasReturnTrip]);
  
  return {
    oneWayDistance,
    oneWayDuration,
    returnDistance,
    returnDuration,
    totalDistance,
    totalDuration,
    handleRouteCalculated,
    handleReturnRouteCalculated
  };
};
