
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
        <CardDescription>Évolution des devis par statut sur les 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeReports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  switch(name) {
                    case 'accepted':
                      return [value, 'Acceptés'];
                    case 'pending':
                      return [value, 'En attente'];
                    case 'declined':
                      return [value, 'Refusés'];
                    default:
                      return [value, name];
                  }
                }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }}
              />
              <Legend />
              <Bar 
                dataKey="accepted" 
                name="Acceptés" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="pending" 
                name="En attente" 
                fill="#fde047" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="declined" 
                name="Refusés" 
                fill="#f87171" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RidesChart;
