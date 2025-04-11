
import { useState, useCallback } from 'react';
import { useMapbox, Address } from '@/hooks/useMapbox';

export function useQuoteAddresses() {
  const { getRoute } = useMapbox();
  
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  // Return trip related state
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);

  const handleDepartureSelect = useCallback((address: Address) => {
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  }, []);

  const handleDestinationSelect = useCallback((address: Address) => {
    setDestinationAddress(address.fullAddress);
    setDestinationCoordinates(address.coordinates);
  }, []);

  const handleReturnAddressSelect = useCallback((address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  }, []);

  const handleRouteCalculated = useCallback((distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  }, []);
  
  const calculateReturnRoute = useCallback(async () => {
    if (!hasReturnTrip || returnToSameAddress || !customReturnCoordinates || !destinationCoordinates) {
      return;
    }
    
    try {
      const route = await getRoute(destinationCoordinates, customReturnCoordinates);
      if (route) {
        setReturnDistance(Math.round(route.distance));
        setReturnDuration(Math.round(route.duration));
      }
    } catch (error) {
      console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
    }
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, getRoute]);

  return {
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    destinationCoordinates,
    estimatedDistance,
    estimatedDuration,
    hasReturnTrip,
    setHasReturnTrip,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    returnDistance,
    returnDuration,
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    calculateReturnRoute
  };
}
