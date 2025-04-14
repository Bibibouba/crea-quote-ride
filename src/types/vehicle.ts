
export interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  vehicle_type_id: string;
  vehicle_type_name?: string;
  is_luxury?: boolean;
  is_active?: boolean;
  image_url?: string | null;
  basePrice?: number;
  description?: string;
  // Nouveaux champs de tarification
  min_trip_distance?: number;
  night_rate_enabled?: boolean;
  night_rate_start?: string;
  night_rate_end?: string;
  night_rate_percentage?: number;
}

export interface VehicleType {
  id: string;
  name: string;
  driver_id: string;
  icon?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type VehicleFormValues = {
  name: string;
  model: string;
  capacity: number;
  vehicle_type_id: string;
  vehicle_type_name?: string;
  is_luxury?: boolean;
  is_active?: boolean;
  image_url?: string | null;
  min_trip_distance?: number;
  night_rate_enabled?: boolean;
  night_rate_start?: string;
  night_rate_end?: string;
  night_rate_percentage?: number;
};
