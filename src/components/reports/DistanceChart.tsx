
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DistanceChartProps {
  data?: Array<{ date: string; distance: number; amount: number }>;
}

export const DistanceChart = ({ data }: DistanceChartProps) => {
  if (!data) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" stroke="#6366F1" />
        <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
        <Tooltip />
        <Bar yAxisId="left" dataKey="distance" fill="#6366F1" name="Distance (km)" />
        <Bar yAxisId="right" dataKey="amount" fill="#10B981" name="Montant (€)" />
      </BarChart>
    </ResponsiveContainer>
  );
};
