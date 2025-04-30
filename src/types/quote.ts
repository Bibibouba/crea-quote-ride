
// Définition du type Quote pour l'application
export type Quote = {
  id: string;
  driver_id: string;
  client_id: string;
  vehicle_id: string | null;
  departure_location: string;
  arrival_location: string;
  ride_date: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'rejected' | 'expired';
  quote_pdf: string | null;
  created_at: string;
  updated_at: string;
  // Propriétés additionnelles
  distance_km?: number;
  duration_minutes?: number;
  has_return_trip?: boolean;
  has_waiting_time?: boolean;
  waiting_time_minutes?: number;
  waiting_time_price?: number;
  night_surcharge?: number;
  sunday_holiday_surcharge?: number;
  amount_ht?: number;
  total_ttc?: number;
  clients?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  vehicles?: {
    name: string;
    model: string;
    basePrice: number;
  } | null;
};
