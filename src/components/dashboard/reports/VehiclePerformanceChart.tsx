
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VehicleReport } from '@/types/reports';

interface VehiclePerformanceChartProps {
  vehicleReports: VehicleReport[];
}

const VehiclePerformanceChart = ({ vehicleReports }: VehiclePerformanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performances par véhicule</CardTitle>
        <CardDescription>Comparaison des indicateurs clés entre vos véhicules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={vehicleReports}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRides" name="Nombre de courses" fill="#add3f0" radius={[0, 4, 4, 0]} />
              <Bar dataKey="totalDistance" name="Distance (km)" fill="#dff1db" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehiclePerformanceChart;
