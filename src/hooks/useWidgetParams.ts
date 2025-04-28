

import { useSearchParams } from 'react-router-dom';

interface WidgetParams {
  prefill?: {
    departure?: string;
    destination?: string;
    date?: string;
    time?: string;
    passengers?: string;
    vehicleType?: string;
  };
}

export function useWidgetParams(): WidgetParams {
  const [searchParams] = useSearchParams();
  
  const prefill = {
    departure: searchParams.get('departure') || undefined,
    destination: searchParams.get('destination') || undefined,
    date: searchParams.get('date') || undefined,
    time: searchParams.get('time') || undefined,
    passengers: searchParams.get('passengers') || undefined,
    vehicleType: searchParams.get('vehicleType') || undefined,
  };

  // Vérifier si au moins un paramètre est défini
  const hasPrefill = Object.values(prefill).some(value => value !== undefined);

  return { 
    prefill: hasPrefill ? prefill : undefined 
  };
}
