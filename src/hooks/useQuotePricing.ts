
import { useState } from 'react';

export interface VehicleOption {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

export function useQuotePricing() {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  
  const vehiclesList: VehicleOption[] = [
    { id: "sedan", name: "Berline", basePrice: 1.8, description: "Mercedes Classe E ou équivalent" },
    { id: "van", name: "Van", basePrice: 2.2, description: "Mercedes Classe V ou équivalent" },
    { id: "luxury", name: "Luxe", basePrice: 2.5, description: "Mercedes Classe S ou équivalent" }
  ];

  return {
    selectedVehicle,
    setSelectedVehicle,
    passengers,
    setPassengers,
    calculatedPrice,
    setCalculatedPrice,
    quoteDetails,
    setQuoteDetails,
    vehicles: vehiclesList
  };
}
