
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeReport } from '@/types/reports';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  timeReports: TimeReport[];
}

const RevenueChart = ({ timeReports }: RevenueChartProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Évolution du CA</CardTitle>
        <CardDescription>Aperçu du chiffre d'affaires sur les 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Chiffre d'affaires"]}
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
  );
};

export default RevenueChart;
