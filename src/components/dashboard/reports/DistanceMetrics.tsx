
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DistanceMetricsProps {
  dayKm: number;
  weekKm: number;
  monthKm: number;
  onTimeRangeChange: (range: 'day' | 'week' | 'month') => void;
}

const DistanceMetrics = ({ dayKm, weekKm, monthKm, onTimeRangeChange }: DistanceMetricsProps) => {
  const formatDistance = (value: number) => `${value.toFixed(1)} km`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance parcourue</CardTitle>
        <CardDescription>Aperçu des distances parcourues sur différentes périodes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day" onClick={() => onTimeRangeChange('day')}>Jour</TabsTrigger>
            <TabsTrigger value="week" onClick={() => onTimeRangeChange('week')}>Semaine</TabsTrigger>
            <TabsTrigger value="month" onClick={() => onTimeRangeChange('month')}>Mois</TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#add3f0]">{formatDistance(dayKm)}</div>
              <div className="text-sm text-muted-foreground">aujourd'hui</div>
            </div>
          </TabsContent>
          <TabsContent value="week" className="pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#add3f0]">{formatDistance(weekKm)}</div>
              <div className="text-sm text-muted-foreground">ces 7 derniers jours</div>
            </div>
          </TabsContent>
          <TabsContent value="month" className="pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#add3f0]">{formatDistance(monthKm)}</div>
              <div className="text-sm text-muted-foreground">ce mois-ci</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DistanceMetrics;
