
import { formatDuration } from '@/lib/formatDuration';

interface OutboundTripDetailsProps {
  distance: number;
  duration: number;
}

export const OutboundTripDetails: React.FC<OutboundTripDetailsProps> = ({ 
  distance, 
  duration 
}) => {
  return (
    <div>
      <p className="text-xs text-muted-foreground">Aller</p>
      <p className="text-sm">{distance} km / {formatDuration(duration)}</p>
    </div>
  );
};
