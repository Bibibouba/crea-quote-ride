
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useDriverReports } from '@/hooks/useDriverReports';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCards from '@/components/dashboard/reports/MetricsCards';
import DistanceMetrics from '@/components/dashboard/reports/DistanceMetrics';
import RevenueChart from '@/components/dashboard/reports/RevenueChart';
import RidesChart from '@/components/dashboard/reports/RidesChart';
import RevenueByVehicleChart from '@/components/dashboard/reports/RevenueByVehicleChart';
import VehiclePerformanceChart from '@/components/dashboard/reports/VehiclePerformanceChart';

const Reports = () => {
  const { reportsData, isLoading } = useDriverReports();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
            <p className="text-muted-foreground">
              Analysez les performances de votre activité et de vos véhicules.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-36" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-60 w-full" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Analysez les performances de votre activité et de vos véhicules.
          </p>
        </div>

        <MetricsCards 
          totalRevenue={reportsData.totalRevenue}
          totalRides={reportsData.totalRides}
          totalDistance={reportsData.totalDistance}
          totalHours={reportsData.totalHours}
          acceptedQuotes={reportsData.acceptedQuotes}
          pendingQuotes={reportsData.pendingQuotes}
          declinedQuotes={reportsData.declinedQuotes}
          totalQuotes={reportsData.totalQuotes}
        />

        <DistanceMetrics 
          dayKm={reportsData.dayKm}
          weekKm={reportsData.weekKm}
          monthKm={reportsData.monthKm}
          onTimeRangeChange={setTimeRange}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <RevenueChart timeReports={reportsData.timeReports} />
          <RidesChart timeReports={reportsData.timeReports} />
        </div>

        <RevenueByVehicleChart revenueByVehicle={reportsData.revenueByVehicle} />
        <VehiclePerformanceChart vehicleReports={reportsData.vehicleReports} />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
