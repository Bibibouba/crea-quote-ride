
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
    // Fetch vehicles with their pricing settings
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_active', true)
      .eq('driver_id', userId);
    
    if (vehiclesError) throw vehiclesError;
    
    if (vehiclesData && vehiclesData.length > 0) {
      // Fetch pricing settings for these vehicles
      const vehicleIds = vehiclesData.map(v => v.id);
      const { data: pricingData, error: pricingError } = await supabase
        .from('vehicle_pricing_settings')
        .select('*')
        .in('vehicle_id', vehicleIds);
        
      if (pricingError) throw pricingError;
      
      // Get driver's global pricing settings
      const { data: globalPricing, error: globalPricingError } = await supabase
        .from('pricing')
        .select('*')
        .eq('driver_id', userId)
        .single();
        
      if (globalPricingError && globalPricingError.code !== 'PGRST116') {
        throw globalPricingError;
      }
      
      // Map vehicles with their pricing settings
      const mappedVehicles = vehiclesData.map(vehicle => {
        const vehiclePricing = pricingData?.find(p => p.vehicle_id === vehicle.id) || {};
        
        return {
          id: vehicle.id,
          name: vehicle.name,
          basePrice: getPriceForVehicle(vehicle.id, globalPricing, vehicleTypes),
          capacity: vehicle.capacity,
          description: vehicle.model,
          // Add vehicle-specific pricing settings
          min_trip_distance: vehiclePricing.min_trip_distance,
          night_rate_enabled: vehiclePricing.night_rate_enabled || false,
          night_rate_start: vehiclePricing.night_rate_start,
          night_rate_end: vehiclePricing.night_rate_end,
          night_rate_percentage: vehiclePricing.night_rate_percentage,
          wait_price_per_15min: vehiclePricing.wait_price_per_15min,
          wait_night_enabled: vehiclePricing.wait_night_enabled || false,
          wait_night_start: vehiclePricing.wait_night_start,
          wait_night_end: vehiclePricing.wait_night_end,
          wait_night_percentage: vehiclePricing.wait_night_percentage,
          minimum_trip_fare: vehiclePricing.minimum_trip_fare,
          holiday_sunday_percentage: vehiclePricing.holiday_sunday_percentage
        };
      });
      
      setPricingCallback(mappedVehicles, selectedVehicle || (mappedVehicles.length > 0 ? mappedVehicles[0].id : ''));
    } else {
      // Use default vehicles if no vehicles found
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
