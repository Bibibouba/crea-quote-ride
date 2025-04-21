
import React, { useState } from 'react';
import { FileBarChart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDriverReports } from '@/hooks/useDriverReports';
import { KPIMetrics } from '@/components/reports/KPIMetrics';
import { TimeDistributionChart } from '@/components/reports/TimeDistributionChart';
import { RevenueChart } from '@/components/reports/RevenueChart';
import { DistanceChart } from '@/components/reports/DistanceChart';
import { cn } from '@/lib/utils';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDriver, setSelectedDriver] = useState('all');
  const { data, isLoading } = useDriverReports(selectedDriver, selectedPeriod);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          <FileBarChart className="inline-block mr-2 h-8 w-8" />
          Rapports {data?.driverName ? `- ${data.driverName}` : ''}
        </h2>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sélectionner un chauffeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les chauffeurs</SelectItem>
              {data?.drivers?.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.company_name || `${driver.first_name} ${driver.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 mt-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Statistiques détaillées</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <KPIMetrics data={data} isLoading={isLoading} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className={cn("col-span-2 bg-[#E3F2FD]", "dark:bg-blue-950/20")}>
              <CardHeader>
                <CardTitle>Chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={data?.revenueData} />
              </CardContent>
            </Card>
            
            <Card className={cn("bg-[#E8F5E9]", "dark:bg-green-950/20")}>
              <CardHeader>
                <CardTitle>Répartition Jour/Nuit</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeDistributionChart data={data?.timeDistribution} />
              </CardContent>
            </Card>
          </div>

          <Card className={cn("bg-[#F3E5F5]", "dark:bg-purple-950/20")}>
            <CardHeader>
              <CardTitle>Distances parcourues</CardTitle>
            </CardHeader>
            <CardContent>
              <DistanceChart data={data?.distanceData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className={cn("bg-[#E3F2FD]", "dark:bg-blue-950/20")}>
            <CardHeader>
              <CardTitle>Statistiques détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analyse des courses</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Taux de courses de nuit</h4>
                    {data?.timeDistribution && (
                      <p className="text-2xl font-bold">
                        {((data.timeDistribution[1].value / 
                          (data.timeDistribution[0].value + data.timeDistribution[1].value)) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Prix moyen par course</h4>
                    <p className="text-2xl font-bold">
                      {data?.totalRevenue && data.numberOfRides ? 
                        `${(data.totalRevenue / data.numberOfRides).toFixed(2)}€` : '0€'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
