
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

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDriver, setSelectedDriver] = useState('all');
  const { data, isLoading } = useDriverReports(selectedDriver, selectedPeriod);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          <FileBarChart className="inline-block mr-2 h-8 w-8" />
          Rapports
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un chauffeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les chauffeurs</SelectItem>
              <SelectItem value="current">Mon activité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 mt-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <KPIMetrics data={data} isLoading={isLoading} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={data?.revenueData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition Jour/Nuit</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeDistributionChart data={data?.timeDistribution} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distances parcourues</CardTitle>
            </CardHeader>
            <CardContent>
              <DistanceChart data={data?.distanceData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          {/* Detailed reports will be added here */}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
