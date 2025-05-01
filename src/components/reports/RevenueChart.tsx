
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data?: Array<{ date: string; amount: number }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  if (!data) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(value)
          }
        />
        <Line type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
