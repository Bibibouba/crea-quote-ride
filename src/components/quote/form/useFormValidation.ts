
import { useState } from 'react';
import { toast } from 'sonner';

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
    selectedVehicle: string | undefined,
    departureCoordinates?: [number, number],
    destinationCoordinates?: [number, number]
  ): boolean => {
    const newErrors = {
      departureAddress: !departureAddress || departureAddress.trim() === '' || !departureCoordinates,
      destinationAddress: !destinationAddress || destinationAddress.trim() === '' || !destinationCoordinates,
      date: !date,
      time: !time || time.trim() === '',
      vehicle: !selectedVehicle,
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      if (newErrors.departureAddress || newErrors.destinationAddress) {
        toast.error('Veuillez sélectionner des adresses valides');
      } else if (newErrors.date || newErrors.time) {
        toast.error('Veuillez spécifier une date et une heure valides');
      } else if (newErrors.vehicle) {
        toast.error('Veuillez sélectionner un véhicule');
      }
    }
    
    return !Object.values(newErrors).some(Boolean);
  };
  
  const focusFirstError = () => {
    const firstError = Object.entries(errors).find(([_, value]) => value)?.[0];
    if (firstError) {
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };
  
  return {
    errors,
    validateTripForm,
    focusFirstError
  };
}
