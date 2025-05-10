
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
  
  // Propriétés pour les coordonnées
  departure_coordinates?: [number, number];
  arrival_coordinates?: [number, number];
  return_coordinates?: [number, number];
  
  // Propriétés pour les informations de retour
  return_to_same_address?: boolean;
  custom_return_address?: string;
  return_distance_km?: number;
  return_duration_minutes?: number;
  
  // Propriétés pour les informations de temps
  night_hours?: number;
  day_hours?: number;
  has_night_rate?: boolean;
  night_rate_percentage?: number;
  
  // Propriétés pour les informations de prix
  day_km?: number;
  night_km?: number;
  total_km?: number;
  day_price?: number;
  night_price?: number;
  is_sunday_holiday?: boolean;
  sunday_holiday_percentage?: number;
  
  // Propriétés pour les informations de temps d'attente
  wait_time_day?: number;
  wait_time_night?: number;
  wait_price_day?: number;
  wait_price_night?: number;
  
  // Propriétés pour les prix détaillés
  one_way_price_ht?: number;
  one_way_price?: number;
  return_price_ht?: number;
  return_price?: number;
  
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
