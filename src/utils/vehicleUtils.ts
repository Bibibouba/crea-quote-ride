
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/quoteForm';
import { VehicleType } from '@/types/vehicle';

export const getPriceForVehicle = (vehicleId: string, pricingSettings: any, vehicleTypes: VehicleType[]): number => {
  if (pricingSettings) {
    return pricingSettings.price_per_km || 1.8;
  }
  
  const vehicleIndex = vehicleTypes.findIndex(v => v.id === vehicleId);
  if (vehicleIndex >= 0) {
    return 1.8 + (vehicleIndex * 0.4);
  }
  
  return 1.8;
};

export const fetchVehicles = async (
  userId: string,
  vehicleTypes: VehicleType[],
  selectedVehicle: string,
  setPricingCallback: (vehicles: Vehicle[], selectedVehicle?: string) => void
) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_active', true);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      const mappedVehicles = data.map(vehicle => ({
        id: vehicle.id,
        name: vehicle.name,
        basePrice: getPriceForVehicle(vehicle.id, null, vehicleTypes),
        capacity: vehicle.capacity,
        description: vehicle.model
      }));
      
      setPricingCallback(mappedVehicles, selectedVehicle || (mappedVehicles.length > 0 ? mappedVehicles[0].id : ''));
    } else {
      const defaultVehicles = vehicleTypes.map((type, index) => ({
        id: type.id,
        name: type.name,
        basePrice: 1.8 + (index * 0.4),
        capacity: 4 + (index * 2),
        description: `Véhicule ${type.name}`
      }));
      
      setPricingCallback(defaultVehicles, selectedVehicle || (defaultVehicles.length > 0 ? defaultVehicles[0].id : ''));
    }
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};
