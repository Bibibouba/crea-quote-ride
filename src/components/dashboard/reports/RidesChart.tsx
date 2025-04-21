
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeReport } from '@/types/reports';

interface RidesChartProps {
  timeReports: TimeReport[];
}

const RidesChart = ({ timeReports }: RidesChartProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Nombre de courses</CardTitle>
        <CardDescription>Évolution du nombre de courses sur les 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value, "Courses"]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                }}
              />
              <Legend />
              <Bar dataKey="rides" name="Courses" fill="#dff1db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RidesChart;
