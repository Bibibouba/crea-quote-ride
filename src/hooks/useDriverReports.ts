import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDriverReports = (driverId: string, period: string) => {
  const { user } = useAuth();
  
  const { data: drivers } = useQuery({
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

  return useQuery({
    queryKey: ['reports', driverId, period],
    queryFn: async () => {
      try {
        // Get the current date
        const now = new Date();
        let startDate = new Date();

        // Calculate the start date based on the selected period
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

        // Build the query
        let query = supabase
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
          .eq('status', 'accepted');

        // Filter by driver if not "all"
        if (driverId !== 'all') {
          query = query.eq('driver_id', driverId);
        }

        const { data: quotes, error } = await query;

        if (error) throw error;

        // Calculate metrics
        const totalRevenue = quotes.reduce((sum, q) => sum + (q.amount || 0), 0);
        const totalDistance = quotes.reduce((sum, q) => sum + (q.distance_km || 0), 0);
        const dayKm = quotes.reduce((sum, q) => sum + (q.day_km || 0), 0);
        const nightKm = quotes.reduce((sum, q) => sum + (q.night_km || 0), 0);
        const avgPricePerKm = totalDistance ? totalRevenue / totalDistance : 0;

        // Prepare time distribution data
        const timeDistribution = [
          { name: 'Jour', value: dayKm },
          { name: 'Nuit', value: nightKm }
        ];

        // Prepare revenue data grouped by date
        const revenueData = quotes.reduce((acc: any[], quote) => {
          const date = new Date(quote.created_at).toLocaleDateString();
          const existing = acc.find(item => item.date === date);
          if (existing) {
            existing.amount += quote.amount;
          } else {
            acc.push({ date, amount: quote.amount });
          }
          return acc;
        }, []);

        // Prepare distance data
        const distanceData = quotes.map(quote => ({
          date: new Date(quote.created_at).toLocaleDateString(),
          distance: quote.distance_km,
          amount: quote.amount
        }));

        // Add driver information
        const driverInfo = drivers?.find(d => d.id === driverId) || null;
        const driverName = driverInfo ? 
          `${driverInfo.company_name || `${driverInfo.first_name} ${driverInfo.last_name}`}` : 
          'Tous les chauffeurs';

        return {
          driverName,
          drivers,
          totalRevenue,
          totalDistance,
          avgPricePerKm,
          numberOfRides: quotes.length,
          timeDistribution,
          revenueData,
          distanceData
        };
      } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
    },
    enabled: !!user
  });
};
