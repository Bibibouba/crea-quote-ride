import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Profile, 
  Quote, 
  Vehicle, 
  VehicleReport, 
  TimeReport, 
  RevenueByVehicle,
  ReportData
} from '@/types/reports';

export const useDriverReports = () => {
  const { user } = useAuth();

  // Fetch user profile data
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch vehicle data
  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('driver_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch quotes data
  const { data: quotesData, isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('driver_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Get user profile
  const profile = profileData && profileData.length > 0 ? profileData[0] as unknown as Profile : null;

  // Calculate vehicle reports
  const vehicleReports: VehicleReport[] = vehiclesData ? vehiclesData.map(vehicle => {
    const vehicleQuotes = quotesData?.filter(quote => quote.vehicle_id === vehicle.id) || [];
    const totalRides = vehicleQuotes.length;
    const totalRevenue = vehicleQuotes.reduce((sum, quote) => sum + (quote.amount || 0), 0);
    const totalDistance = vehicleQuotes.reduce((sum, quote) => sum + (quote.distance_km || 0), 0);
    const totalHours = vehicleQuotes.reduce((sum, quote) => sum + ((quote.duration_minutes || 0) / 60), 0);
    const averageRevenuePerKm = totalDistance > 0 ? totalRevenue / totalDistance : 0;

    return {
      id: vehicle.id,
      name: vehicle.name,
      model: vehicle.model,
      totalRides,
      totalRevenue,
      totalDistance,
      totalHours,
      averageRevenuePerKm
    };
  }) : [];

  // Calculate time reports with status breakdown
  const timeReports: TimeReport[] = [];
  if (quotesData) {
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayQuotes = quotesData.filter(quote => {
        const quoteDate = new Date(quote.created_at);
        return quoteDate.getDate() === date.getDate() && 
               quoteDate.getMonth() === date.getMonth() && 
               quoteDate.getFullYear() === date.getFullYear();
      });

      const accepted = dayQuotes.filter(q => q.status === 'accepted').length;
      const pending = dayQuotes.filter(q => q.status === 'pending').length;
      const declined = dayQuotes.filter(q => q.status === 'declined').length;
      
      timeReports.push({
        date: date.toISOString().split('T')[0],
        revenue: dayQuotes.reduce((sum, quote) => sum + (quote.amount || 0), 0),
        rides: dayQuotes.length,
        distance: dayQuotes.reduce((sum, quote) => sum + (quote.distance_km || 0), 0),
        accepted,
        pending,
        declined
      });
    }
  }

  // Calculate revenue by vehicle
  const revenueByVehicle: RevenueByVehicle[] = [];
  if (vehicleReports.length > 0) {
    const totalRevenue = vehicleReports.reduce((sum, report) => sum + report.totalRevenue, 0);
    
    vehicleReports.forEach(report => {
      if (report.totalRevenue > 0) {
        revenueByVehicle.push({
          name: report.name,
          value: report.totalRevenue,
          percent: totalRevenue > 0 ? (report.totalRevenue / totalRevenue) * 100 : 0
        });
      }
    });
  }

  // Calculate totals
  const totalRevenue = vehicleReports.reduce((sum, report) => sum + report.totalRevenue, 0);
  const totalRides = vehicleReports.reduce((sum, report) => sum + report.totalRides, 0);
  const totalDistance = vehicleReports.reduce((sum, report) => sum + report.totalDistance, 0);
  const totalHours = vehicleReports.reduce((sum, report) => sum + report.totalHours, 0);

  // Calculate distance metrics for different time periods
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const dayKm = quotesData ? quotesData.reduce((sum, quote) => {
    const quoteDate = new Date(quote.created_at);
    return quoteDate >= dayStart ? sum + (quote.distance_km || 0) : sum;
  }, 0) : 0;

  const weekKm = quotesData ? quotesData.reduce((sum, quote) => {
    const quoteDate = new Date(quote.created_at);
    return quoteDate >= weekStart ? sum + (quote.distance_km || 0) : sum;
  }, 0) : 0;

  const monthKm = quotesData ? quotesData.reduce((sum, quote) => {
    const quoteDate = new Date(quote.created_at);
    return quoteDate >= monthStart ? sum + (quote.distance_km || 0) : sum;
  }, 0) : 0;

  // Calculate quotes status metrics
  const acceptedQuotes = quotesData?.filter(q => q.status === 'accepted').length || 0;
  const pendingQuotes = quotesData?.filter(q => q.status === 'pending').length || 0;
  const declinedQuotes = quotesData?.filter(q => q.status === 'declined').length || 0;
  const totalQuotes = (quotesData?.length || 0);

  const reportsData: ReportData = {
    vehicles: vehiclesData || [],
    quotes: quotesData || [],
    vehicleReports,
    timeReports,
    revenueByVehicle,
    totalRevenue,
    totalRides,
    totalDistance,
    totalHours,
    dayKm,
    weekKm,
    monthKm,
    acceptedQuotes,
    pendingQuotes,
    declinedQuotes,
    totalQuotes
  };

  return {
    profile,
    reportsData,
    isLoading
  };
};
