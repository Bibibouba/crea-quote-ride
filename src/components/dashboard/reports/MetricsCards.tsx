
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface MetricsCardsProps {
  totalRevenue: number;
  totalRides: number;
  totalDistance: number;
  totalHours: number;
}

const MetricsCards = ({ totalRevenue, totalRides, totalDistance, totalHours }: MetricsCardsProps) => {
  const formatDistance = (value: number) => `${value.toFixed(1)} km`;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-[#dff1db]/50 to-[#dff1db]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'affaires total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-[#add3f0]/50 to-[#add3f0]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Nombre de courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRides}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-[#f9e4d4]/50 to-[#f9e4d4]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Distance totale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDistance(totalDistance)}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-[#f5dbe8]/50 to-[#f5dbe8]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Heures de service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)} h</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
