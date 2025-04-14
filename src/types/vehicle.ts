
export interface Vehicle {
  id: string;
  driver_id: string;
  name: string;
  model: string;
  capacity: number;
  is_active: boolean;
  is_luxury: boolean;
  image_url: string | null;
  vehicle_type_id: string | null;
  vehicle_type_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleFormValues {
  name: string;
  model: string;
  capacity: number;
  is_active: boolean;
  is_luxury: boolean;
  image_url?: string | null;
  vehicle_type_id: string;
  vehicle_type_name?: string | null;
  id?: string;
}

export interface VehicleType {
  id: string;
  name: string;
  driver_id: string;
  created_at: string;
  updated_at: string;
  is_default?: boolean;
  icon?: string; // Added icon property
}
