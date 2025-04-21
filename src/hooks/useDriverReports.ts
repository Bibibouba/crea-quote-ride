import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DriverStats, ReportData } from '@/types/reports';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useDriverReports = (driverId: string, period: string) => {
  const { user } = useAuth();
  
  const { data: drivers } = useQuery<Profile[]>({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, company_name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  return useQuery<ReportData>({
    queryKey: ['reports', driverId, period],
    queryFn: async () => {
      try {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        const driversToFetch = driverId === 'all' ? drivers : [drivers?.find(d => d.id === driverId)];
        
        const driversStats = await Promise.all(
          driversToFetch?.map(async (driver): Promise<DriverStats> => {
            const { data: quotes, error } = await supabase
              .from('quotes')
              .select(`
                *,
                clients (
                  first_name,
                  last_name
                )
              `)
              .gte('created_at', startDate.toISOString())
              .lte('created_at', now.toISOString())
              .eq('status', 'accepted')
              .eq('driver_id', driver?.id);

            if (error) throw error;

            const totalRevenue = quotes.reduce((sum, q) => sum + (q.amount || 0), 0);
            const totalDistance = quotes.reduce((sum, q) => sum + (q.distance_km || 0), 0);
            const dayKm = quotes.reduce((sum, q) => sum + (q.day_km || 0), 0);
            const nightKm = quotes.reduce((sum, q) => sum + (q.night_km || 0), 0);

            return {
              ...driver,
              totalRevenue,
              totalDistance,
              numberOfRides: quotes.length,
              dayKm,
              nightKm,
              avgPricePerKm: totalDistance ? totalRevenue / totalDistance : 0
            };
          }) || []
        );

        const selectedDriverData: Partial<ReportData> = driverId === 'all' 
          ? driversStats.reduce((acc, curr) => ({
              totalRevenue: (acc.totalRevenue || 0) + curr.totalRevenue,
              totalDistance: (acc.totalDistance || 0) + curr.totalDistance,
              numberOfRides: (acc.numberOfRides || 0) + curr.numberOfRides,
              dayKm: (acc.dayKm || 0) + curr.dayKm,
              nightKm: (acc.nightKm || 0) + curr.nightKm
            }), {} as Partial<ReportData>)
          : driversStats[0];

        const timeDistribution = [
          { name: 'Jour', value: selectedDriverData.dayKm || 0 },
          { name: 'Nuit', value: selectedDriverData.nightKm || 0 }
        ];

        const driverInfo = drivers?.find(d => d.id === driverId);
        const driverName = driverInfo 
          ? `${driverInfo.company_name || `${driverInfo.first_name} ${driverInfo.last_name}`}` 
          : 'Tous les chauffeurs';

        const revenueData = [];
        const distanceData = [];
        const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          revenueData.unshift({
            date: date.toLocaleDateString(),
            amount: Math.random() * 1000,
            distance: Math.random() * 100
          });
          distanceData.unshift({
            date: date.toLocaleDateString(),
            amount: Math.random() * 1000,
            distance: Math.random() * 100
          });
        }

        return {
          driverName,
          drivers: driversStats,
          ...selectedDriverData,
          timeDistribution,
          revenueData,
          distanceData,
          avgPricePerKm: selectedDriverData.totalDistance 
            ? selectedDriverData.totalRevenue! / selectedDriverData.totalDistance 
            : 0
        } as ReportData;
      } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
    },
    enabled: !!user
  });
};
