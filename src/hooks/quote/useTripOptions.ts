
import { useState } from 'react';
import { WaitingTimeOption } from '@/types/quoteForm';

interface UseTripOptionsProps {
  waitingTimeOptions: WaitingTimeOption[];
}

export const useTripOptions = ({ waitingTimeOptions }: UseTripOptionsProps) => {
  // Use current date as default
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [time, setTime] = useState('12:00');
  const [passengers, setPassengers] = useState('1');
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };
  
  // Custom date setter that validates the date
  const safeSetDate = (newDate: Date | undefined) => {
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      setDate(newDate);
    } else {
      setDate(today); // Fallback to today if invalid
    }
  };
  
  return {
    date,
    setDate: safeSetDate,
    time,
    setTime,
    passengers,
    setPassengers,
    hasReturnTrip,
    setHasReturnTrip,
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    returnToSameAddress,
    setReturnToSameAddress,
    estimatedDistance,
    setEstimatedDistance,
    estimatedDuration,
    setEstimatedDuration,
    waitingTimeOptions,
    handleRouteCalculated
  };
};
