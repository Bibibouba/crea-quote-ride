
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MinDistanceAlertProps {
  estimatedDistance: number;
  minDistance: number;
}

export const MinDistanceAlert = ({ estimatedDistance, minDistance }: MinDistanceAlertProps) => {
  return (
    <Alert variant="warning" className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Distance minimale</AlertTitle>
      <AlertDescription className="text-amber-700">
        La distance de ce trajet ({estimatedDistance} km) est inférieure à la distance minimale facturée pour ce véhicule ({minDistance} km).
        Un supplément sera appliqué pour atteindre la distance minimale.
      </AlertDescription>
    </Alert>
  );
};
