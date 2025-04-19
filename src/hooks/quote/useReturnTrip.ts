
import { useState, useMemo } from 'react';
import { Address } from '@/hooks/useMapbox';

export function useReturnTrip() {
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>();
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);

  const handleReturnRouteCalculated = (distance: number, duration: number) => {
    setReturnDistance(Math.round(distance));
    setReturnDuration(Math.round(duration));
  };

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  };

  return {
    hasReturnTrip,
    setHasReturnTrip,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    returnDistance,
    returnDuration,
    handleReturnRouteCalculated,
    handleReturnAddressSelect
  };
}
