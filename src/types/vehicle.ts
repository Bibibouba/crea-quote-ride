
export interface VehicleType {
  id: string;
  name: string;
  driver_id: string;
  is_default: boolean;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  image_url: string | null;
  is_luxury: boolean;
  is_active: boolean;
  vehicle_type_id: string | null;
  vehicle_type_name: string | null;
  driver_id: string;
  created_at: string;
  updated_at: string;
}
