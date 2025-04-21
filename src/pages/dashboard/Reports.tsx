
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDriverReports } from '@/hooks/useDriverReports';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const Reports = () => {
  const { reportsData, isLoading } = useDriverReports();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Custom colors for the charts
  const COLORS = ['#add3f0', '#dff1db', '#f9e4d4', '#f5dbe8', '#e8dffa'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDistance = (value: number) => {
    return `${value.toFixed(1)} km`;
  };

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
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="md:col-span-1 h-80">
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-60 w-full" />
                </CardContent>
              </Card>
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

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#dff1db]/50 to-[#dff1db]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(reportsData.totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#add3f0]/50 to-[#add3f0]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre de courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.totalRides}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#f9e4d4]/50 to-[#f9e4d4]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Distance totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDistance(reportsData.totalDistance)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#f5dbe8]/50 to-[#f5dbe8]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Heures de service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.totalHours.toFixed(1)} h</div>
            </CardContent>
          </Card>
        </div>

        {/* Distance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Distance parcourue</CardTitle>
            <CardDescription>Aperçu des distances parcourues sur différentes périodes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day" onClick={() => setTimeRange('day')}>Jour</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setTimeRange('week')}>Semaine</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setTimeRange('month')}>Mois</TabsTrigger>
              </TabsList>
              <TabsContent value="day" className="pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#add3f0]">{formatDistance(reportsData.dayKm)}</div>
                  <div className="text-sm text-muted-foreground">aujourd'hui</div>
                </div>
              </TabsContent>
              <TabsContent value="week" className="pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#add3f0]">{formatDistance(reportsData.weekKm)}</div>
                  <div className="text-sm text-muted-foreground">ces 7 derniers jours</div>
                </div>
              </TabsContent>
              <TabsContent value="month" className="pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#add3f0]">{formatDistance(reportsData.monthKm)}</div>
                  <div className="text-sm text-muted-foreground">ce mois-ci</div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Revenue Over Time Chart */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Évolution du CA</CardTitle>
              <CardDescription>Aperçu du chiffre d'affaires sur les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportsData.timeReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Chiffre d'affaires']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Chiffre d'affaires" 
                      stroke="#add3f0" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rides Over Time Chart */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Nombre de courses</CardTitle>
              <CardDescription>Évolution du nombre de courses sur les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportsData.timeReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Courses']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="rides" 
                      name="Courses" 
                      fill="#dff1db" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue By Vehicle */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition du CA par véhicule</CardTitle>
            <CardDescription>Part de chaque véhicule dans le chiffre d'affaires total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportsData.revenueByVehicle}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportsData.revenueByVehicle.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Chiffre d'affaires']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Performances par véhicule</CardTitle>
            <CardDescription>Comparaison des indicateurs clés entre vos véhicules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportsData.vehicleReports}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="totalRides" 
                    name="Nombre de courses" 
                    fill="#add3f0" 
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar 
                    dataKey="totalDistance" 
                    name="Distance (km)" 
                    fill="#dff1db" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
