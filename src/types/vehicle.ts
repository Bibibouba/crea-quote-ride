
export interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  image_url?: string;
  is_luxury: boolean;
  is_active: boolean;
  vehicle_type_name?: string;
  vehicle_type_id?: string;
}

export interface VehicleType {
  id: string;
  name: string;
  driver_id: string;
  is_default?: boolean;
  icon?: string | null;
  created_at: string;
  updated_at: string;
}
