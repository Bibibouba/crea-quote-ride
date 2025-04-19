
import { formatDuration } from '@/lib/formatDuration';

interface ReturnTripDetailsProps {
  enabled: boolean;
  distance: number;
  duration: number;
  returnToSameAddress: boolean;
}

export const ReturnTripDetails: React.FC<ReturnTripDetailsProps> = ({ 
  enabled,
  distance,
  duration,
  returnToSameAddress
}) => {
  if (!enabled) return null;
  
  return (
    <div>
      <p className="text-xs text-muted-foreground">Retour</p>
      <p className="text-sm">
        {returnToSameAddress ? distance : distance} km / {formatDuration(returnToSameAddress ? duration : duration)}
      </p>
    </div>
  );
};
