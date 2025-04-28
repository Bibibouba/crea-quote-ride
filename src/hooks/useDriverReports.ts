
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { driverReportsService } from '@/services/reports/driverReportsService';

export const useDriverReports = () => {
  const { user } = useAuth();

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['driver-reports', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      return driverReportsService.fetchReportsData(user.id);
    },
    enabled: !!user
  });

  return {
    reportsData: reportsData || {
      vehicles: [],
      quotes: [],
      vehicleReports: [],
      timeReports: [],
      revenueByVehicle: [],
      totalRevenue: 0,
      totalRides: 0,
      totalDistance: 0,
      totalHours: 0,
      dayKm: 0,
      weekKm: 0,
      monthKm: 0,
      acceptedQuotes: 0,
      pendingQuotes: 0,
      declinedQuotes: 0,
      totalQuotes: 0
    },
    isLoading
  };
};
