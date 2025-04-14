
import { ArrowLeft } from 'lucide-react';
import { PriceFormatter } from './PriceFormatter';
import { formatDuration } from '@/lib/formatDuration';

interface ReturnTripDisplayProps {
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress?: string;
  returnPrice: number;
  returnDistance?: number;
  returnDuration?: number;
}

export const ReturnTripDisplay: React.FC<ReturnTripDisplayProps> = ({
  hasReturnTrip,
  returnToSameAddress,
  customReturnAddress,
  returnPrice,
  returnDistance,
  returnDuration
}) => {
  if (!hasReturnTrip) return null;
  
  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="font-medium">
            Trajet retour {returnToSameAddress ? '(même adresse)' : ''}
          </p>
        </div>
        <PriceFormatter price={returnPrice} />
      </div>
      
      {!returnToSameAddress && customReturnAddress && (
        <div className="text-sm text-muted-foreground">
          <p className="break-words">Adresse de retour : {customReturnAddress}</p>
          {returnDistance && returnDistance > 0 && (
            <p className="mt-1">Distance : {returnDistance} km | Durée : {formatDuration(returnDuration || 0)}</p>
          )}
        </div>
      )}
    </>
  );
};
