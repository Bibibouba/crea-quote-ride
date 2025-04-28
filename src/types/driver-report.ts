
export type RawQuote = {
  id: string;
  driver_id: string;
  vehicle_type_id?: string;
  departure_datetime: string;
  base_fare: number;
  holiday_surcharge?: number;
  night_surcharge?: number;
  include_return?: boolean;
  outbound_duration_minutes: number;
  total_distance: number;
  waiting_fare?: number;
  waiting_time_minutes?: number;
  total_fare: number;
  sunday_surcharge?: number;
  created_at: string;
  // Champs absents de la table quotes mais utilisés dans le code
  vehicle_id?: string;
  distance_km?: number;
  duration_minutes?: number;
  status?: string;
  amount?: number;
};

export interface DriverReport {
  id: string;
  driverId: string;
  vehicleId?: string;
  rideDate: string;
  baseFare: number;
  holidaySurcharge: number;
  nightSurcharge: number;
  includeReturn: boolean;
  durationMinutes: number;
  waitingTimeMinutes: number;
  amount: number;
  distanceKm: number;
  status: string;
  createdAt: string;
}
