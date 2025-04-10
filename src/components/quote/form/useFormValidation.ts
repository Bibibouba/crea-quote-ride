
import { useState } from 'react';

interface TripFormErrors {
  departureAddress: boolean;
  destinationAddress: boolean;
  date: boolean;
  time: boolean;
  vehicle: boolean;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<TripFormErrors>({
    departureAddress: false,
    destinationAddress: false,
    date: false,
    time: false,
    vehicle: false,
  });
  
  const validateTripForm = (
    departureAddress: string | undefined,
    destinationAddress: string | undefined,
    date: Date | undefined,
    time: string | undefined,
    selectedVehicle: string | undefined
  ): boolean => {
    const newErrors = {
      departureAddress: !departureAddress || departureAddress.trim() === '',
      destinationAddress: !destinationAddress || destinationAddress.trim() === '',
      date: !date,
      time: !time || time.trim() === '',
      vehicle: !selectedVehicle,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  
  const focusFirstError = () => {
    const firstError = Object.entries(errors).find(([_, value]) => value)?.[0];
    if (firstError) {
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  return {
    errors,
    validateTripForm,
    focusFirstError
  };
}
