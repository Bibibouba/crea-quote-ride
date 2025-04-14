
import { Clock } from 'lucide-react';
import { PriceFormatter } from './PriceFormatter';

interface WaitingTimeDisplayProps {
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
}

export const formatWaitingTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours} heure${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};

export const WaitingTimeDisplay: React.FC<WaitingTimeDisplayProps> = ({
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice
}) => {
  if (!hasWaitingTime) return null;
  
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
        <p className="font-medium">Temps d'attente ({formatWaitingTime(waitingTimeMinutes)})</p>
      </div>
      <PriceFormatter price={waitingTimePrice} />
    </div>
  );
};
