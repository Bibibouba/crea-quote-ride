
import { useState, useEffect } from 'react';
import { Address } from '@/hooks/useMapbox';
import { format } from 'date-fns';

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export function useTripDetails() {
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [estimatedDistance, setEstimatedDistance] = useState(40);
  const [estimatedDuration, setEstimatedDuration] = useState(45);
  
  // Return trip related states
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  
  // Waiting time related states
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  
  const waitingTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const minutes = (i + 1) * 15;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let label = "";
    if (hours > 0) {
      label += `${hours} heure${hours > 1 ? 's' : ''}`;
      if (remainingMinutes > 0) {
        label += ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else {
      label = `${minutes} minutes`;
    }
    
    return {
      value: minutes,
      label
    };
  });
  
  const handleDepartureSelect = (address: Address) => {
    console.log("Setting departure address:", address);
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  };

  const handleDestinationSelect = (address: Address) => {
    console.log("Setting destination address:", address);
    setDestinationAddress(address.fullAddress);
    setDestinationCoordinates(address.coordinates);
  };

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  };

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };
  
  const formatTripDetails = () => {
    const tripDate = date ? format(date, 'dd/MM/yyyy') : '';
    
    return {
      tripDate,
      departureAddress,
      destinationAddress,
      time,
      customReturnAddress,
      hasReturnTrip,
      returnToSameAddress,
      hasWaitingTime,
      waitingTimeMinutes
    };
  };
  
  return {
    // Trip details
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    destinationCoordinates,
    date,
    setDate,
    time,
    setTime,
    selectedVehicle,
    setSelectedVehicle,
    passengers,
    setPassengers,
    estimatedDistance,
    setEstimatedDistance,
    estimatedDuration,
    setEstimatedDuration,
    
    // Return trip details
    hasReturnTrip,
    setHasReturnTrip,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    returnDistance,
    returnDuration,
    
    // Waiting time details
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    waitingTimePrice,
    setWaitingTimePrice,
    waitingTimeOptions,
    
    // Handlers
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    formatTripDetails
  };
}
