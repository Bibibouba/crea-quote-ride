
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

  // Coordonnées
  departure_coordinates?: [number, number];
  arrival_coordinates?: [number, number];
  return_coordinates?: [number, number];

  // Tarification & durée
  distance_km?: number;
  duration_minutes?: number;
  return_distance_km?: number;
  return_duration_minutes?: number;
  day_km?: number;
  night_km?: number;
  total_km?: number;
  day_price?: number;
  night_price?: number;
  amount_ht?: number;
  total_ttc?: number;

  one_way_price_ht?: number;
  one_way_price?: number;
  return_price_ht?: number;
  return_price?: number;

  wait_time_day?: number;
  wait_time_night?: number;
  wait_price_day?: number;
  wait_price_night?: number;

  waiting_time_minutes?: number;
  waiting_time_price?: number;

  night_surcharge?: number;
  sunday_holiday_surcharge?: number;
  sunday_holiday_percentage?: number;

  night_hours?: number;
  day_hours?: number;
  night_rate_percentage?: number;
  has_night_rate?: boolean;
  is_sunday_holiday?: boolean;

  has_return_trip?: boolean;
  has_waiting_time?: boolean;
  return_to_same_address?: boolean;
  custom_return_address?: string;

  // Relations
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
