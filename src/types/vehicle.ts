
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
