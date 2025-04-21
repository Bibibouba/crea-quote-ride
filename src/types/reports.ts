
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  created_at: string;
  updated_at: string;
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
  client_id: string;
  vehicle_id: string | null;
  ride_date: string;
  amount: number;
  departure_location: string;
  arrival_location: string;
  status: string;
  created_at: string;
  distance_km: number;
  duration_minutes: number;
  amount_ht: number;
  total_ttc: number;
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
}
