
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface MetricsCardsProps {
  totalRevenue: number;
  totalRides: number;
  totalDistance: number;
  totalHours: number;
  acceptedQuotes: number;
  pendingQuotes: number;
  declinedQuotes: number;
  totalQuotes: number;
}

const MetricsCards = ({ 
  totalRevenue, 
  totalRides, 
  totalDistance, 
  totalHours,
  acceptedQuotes,
  pendingQuotes,
  declinedQuotes,
  totalQuotes
}: MetricsCardsProps) => {
  const acceptanceRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes * 100).toFixed(1) : '0';
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Sur {totalRides} courses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux d'acceptation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{acceptanceRate}%</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {acceptedQuotes} acceptés
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Devis en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingQuotes}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Clock className="mr-1 h-3 w-3" />
              En attente
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Devis refusés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{declinedQuotes}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <XCircle className="mr-1 h-3 w-3" />
              Refusés
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
