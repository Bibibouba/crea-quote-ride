
export interface DriverStats {
  id: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  totalRevenue: number;
  totalDistance: number;
  numberOfRides: number;
  dayKm: number;
  nightKm: number;
  avgPricePerKm: number;
}

export interface TimeDistribution {
  name: string;
  value: number;
}

export interface ChartDataPoint {
  date: string;
  amount: number;
  distance: number;
}

export interface ReportData {
  driverName: string;
  drivers: DriverStats[];
  totalRevenue: number;
  totalDistance: number;
  numberOfRides: number;
  dayKm: number;
  nightKm: number;
  timeDistribution: TimeDistribution[];
  avgPricePerKm: number;
  revenueData?: ChartDataPoint[];
  distanceData?: ChartDataPoint[];
}
