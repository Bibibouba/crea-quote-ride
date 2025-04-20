
import { useState } from 'react';
import { Vehicle } from '@/types/quoteForm';
import { useVehicleData } from '../useVehicleData';
import { usePricing } from '@/hooks/use-pricing';

export const useVehicleState = () => {
  const { pricingSettings } = usePricing();
  const {
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle
  } = useVehicleData();

  // Calculate base price
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;

  return {
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle,
    basePrice,
    pricingSettings
  };
};
