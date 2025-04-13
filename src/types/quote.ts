
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'declined';

export interface Quote {
  id: string;
  client_id: string;
  driver_id: string;
  vehicle_id: string | null;
  departure_location: string;
  arrival_location: string;
  departure_coordinates: [number, number];
  arrival_coordinates: [number, number];
  distance_km: number;
  duration_minutes: number;
  ride_date: string;
  amount: number;
  status: QuoteStatus;
  has_return_trip: boolean;
  has_waiting_time: boolean;
  waiting_time_minutes: number | null;
  waiting_time_price: number | null;
  return_to_same_address: boolean;
  custom_return_address: string | null;
  return_coordinates: [number, number] | null;
  return_distance_km: number | null;
  return_duration_minutes: number | null;
  quote_pdf: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations loaded with joins
  clients?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicles?: {
    name: string;
    model: string;
  };
}
