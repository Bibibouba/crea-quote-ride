
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
};
