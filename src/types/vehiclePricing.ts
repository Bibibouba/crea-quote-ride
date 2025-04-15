
export interface VehiclePricingSettings {
  id?: string;
  vehicle_id: string;
  driver_id: string;
  
  // Paramètres de base
  price_per_km?: number;
  minimum_trip_fare?: number;
  min_trip_distance?: number;
  holiday_sunday_percentage?: number;
  
  // Paramètres de tarifs de nuit
  night_rate_enabled?: boolean;
  night_rate_start?: string;
  night_rate_end?: string;
  night_rate_percentage?: number;
  
  // Paramètres de tarifs d'attente
  wait_price_per_15min?: number;
  wait_night_enabled?: boolean;
  wait_night_start?: string;
  wait_night_end?: string;
  wait_night_percentage?: number;
  
  created_at?: string;
  updated_at?: string;
}
