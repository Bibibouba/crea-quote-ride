export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: "admin" | "driver" | "client";
  is_approved: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  is_luxury: boolean;
  is_active: boolean;
  image_url: string | null;
  vehicle_type_id: string | null;
  vehicle_type_name: string;
}

export interface Quote {
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
  created_at: string;
  vehicle_type_id?: string;
  // Removed amount_ht and total_ttc as they don't exist in the database
}

export interface VehicleReport {
  id: string;
  name: string;
  model: string;
  totalRides: number;
  totalRevenue: number;
  totalDistance: number;
  totalHours: number;
  averageRevenuePerKm: number;
}

export interface TimeReport {
  date: string;
  revenue: number;
  rides: number;
  distance: number;
  accepted: number;
  pending: number;
  declined: number;
}

export interface RevenueByVehicle {
  name: string;
  value: number;
  percent: number;
}

export interface ReportData {
  vehicles: Vehicle[];
  quotes: Quote[];
  vehicleReports: VehicleReport[];
  timeReports: TimeReport[];
  revenueByVehicle: RevenueByVehicle[];
  totalRevenue: number;
  totalRides: number;
  totalDistance: number;
  totalHours: number;
  dayKm: number;
  weekKm: number;
  monthKm: number;
  acceptedQuotes: number;
  pendingQuotes: number;
  declinedQuotes: number;
  totalQuotes: number;
}
