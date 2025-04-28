
export type RawDriverReport = {
  id: string;
  driver_id: string;
  departure_datetime: string;
  base_fare: number;
  total_fare: number;
  holiday_surcharge?: number;
  night_surcharge?: number;
  include_return?: boolean;
  outbound_duration_minutes: number;
  total_distance: number;
  waiting_fare?: number;
  waiting_time_minutes?: number;
  sunday_surcharge?: number;
  vehicle_type_id?: string;
  created_at: string;
  updated_at?: string;
  status?: 'pending' | 'accepted' | 'declined';
  
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
  };
};
