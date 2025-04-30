
export type RawQuote = {
  id: string;
  driver_id: string;
  client_id?: string;
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
  quote_pdf?: string;
  created_at: string;
  updated_at?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
}
