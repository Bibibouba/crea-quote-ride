
import { supabase } from '@/integrations/supabase/client';
import type { RawDriverReport } from '@/types/raw-report';
import type { ReportData, TimeReport, VehicleReport, RevenueByVehicle } from '@/types/reports';

export const driverReportsService = {
  async fetchReportsData(userId: string): Promise<ReportData> {
    const { data: vehiclesData } = await supabase
      .from('vehicles')
      .select('*')
      .eq('driver_id', userId);

    const { data: quotesData } = await supabase
      .from('quotes')
      .select(`
        id,
        driver_id,
        vehicle_type_id,
        departure_datetime,
        base_fare,
        total_fare,
        holiday_surcharge,
        night_surcharge,
        include_return,
        outbound_duration_minutes,
        total_distance,
        waiting_fare,
        waiting_time_minutes,
        sunday_surcharge,
        created_at
      `)
      .eq('driver_id', userId);

    const rawQuotes = quotesData as RawDriverReport[] || [];

    // Calculate vehicle reports
    const vehicleReports: VehicleReport[] = vehiclesData ? vehiclesData.map(vehicle => {
      const vehicleQuotes = rawQuotes.filter(quote => quote.vehicle_type_id === vehicle.id) || [];
      const totalRides = vehicleQuotes.length;
      const totalRevenue = vehicleQuotes.reduce((sum, quote) => sum + (quote.total_fare || 0), 0);
      const totalDistance = vehicleQuotes.reduce((sum, quote) => sum + (quote.total_distance || 0), 0);
      const totalHours = vehicleQuotes.reduce((sum, quote) => sum + ((quote.outbound_duration_minutes || 0) / 60), 0);
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

    // Calculate time reports
    const timeReports: TimeReport[] = [];
    const currentDate = new Date(); // Renommé maintenant pour éviter la redéclaration
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      const dayQuotes = rawQuotes.filter(quote => {
        const quoteDate = new Date(quote.created_at);
        return quoteDate.getDate() === date.getDate() && 
               quoteDate.getMonth() === date.getMonth() && 
               quoteDate.getFullYear() === date.getFullYear();
      });

      timeReports.push({
        date: date.toISOString().split('T')[0],
        revenue: dayQuotes.reduce((sum, quote) => sum + (quote.total_fare || 0), 0),
        rides: dayQuotes.length,
        distance: dayQuotes.reduce((sum, quote) => sum + (quote.total_distance || 0), 0),
        accepted: 0,
        pending: 0,
        declined: 0
      });
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

    // Calculate distance metrics
    // Utiliser la variable renommée pour éviter la redéclaration
    const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - 7);
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const dayKm = rawQuotes.reduce((sum, quote) => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate >= dayStart ? sum + (quote.total_distance || 0) : sum;
    }, 0);

    const weekKm = rawQuotes.reduce((sum, quote) => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate >= weekStart ? sum + (quote.total_distance || 0) : sum;
    }, 0);

    const monthKm = rawQuotes.reduce((sum, quote) => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate >= monthStart ? sum + (quote.total_distance || 0) : sum;
    }, 0);

    const totalRevenue = vehicleReports.reduce((sum, report) => sum + report.totalRevenue, 0);
    const totalRides = vehicleReports.reduce((sum, report) => sum + report.totalRides, 0);
    const totalDistance = vehicleReports.reduce((sum, report) => sum + report.totalDistance, 0);
    const totalHours = vehicleReports.reduce((sum, report) => sum + report.totalHours, 0);

    return {
      vehicles: vehiclesData || [],
      quotes: rawQuotes,
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
      acceptedQuotes: 0,
      pendingQuotes: 0,
      declinedQuotes: 0,
      totalQuotes: rawQuotes.length
    };
  }
};
