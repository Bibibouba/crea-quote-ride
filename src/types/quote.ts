
export type Quote = {
  id: string;
  driver_id: string;
  client_id: string;
  vehicle_id: string | null;
  departure_location: string;
  arrival_location: string;
  ride_date: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined';
  quote_pdf: string | null;
  created_at: string;
  updated_at: string;
  distance_km?: number;
  duration_minutes?: number;
  has_return_trip?: boolean;
  has_waiting_time?: boolean;
  waiting_time_minutes?: number;
  waiting_time_price?: number;
  return_to_same_address?: boolean;
  custom_return_address?: string;
  return_distance_km?: number;
  return_duration_minutes?: number;
  return_coordinates?: [number, number];
  departure_coordinates?: [number, number];
  arrival_coordinates?: [number, number];
};
