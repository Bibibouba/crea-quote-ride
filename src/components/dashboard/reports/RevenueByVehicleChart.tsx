
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueByVehicle } from '@/types/reports';
import { formatCurrency } from '@/lib/utils';

interface RevenueByVehicleChartProps {
  revenueByVehicle: RevenueByVehicle[];
}

const COLORS = ['#add3f0', '#dff1db', '#f9e4d4', '#f5dbe8', '#e8dffa'];

const RevenueByVehicleChart = ({ revenueByVehicle }: RevenueByVehicleChartProps) => {
  return (
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
                data={revenueByVehicle}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {revenueByVehicle.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Chiffre d'affaires"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueByVehicleChart;
