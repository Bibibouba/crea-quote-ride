
import React from 'react';
import { Clock } from 'lucide-react';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { formatWaitingTime } from './WaitingTimeDisplay';

interface WaitingTimeDetailDisplayProps {
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  quoteDetails?: any;
}

export const WaitingTimeDetailDisplay: React.FC<WaitingTimeDetailDisplayProps> = ({
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  quoteDetails
}) => {
  if (!hasWaitingTime || !quoteDetails?.waitingTimeDetails) return null;
  
  const {
    waitPriceDay,
    waitPriceNight,
    totalWaitPriceHT,
    waitingVatAmount,
    totalWaitPriceTTC
  } = quoteDetails.waitingTimeDetails;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="font-medium">Temps d'attente ({formatWaitingTime(waitingTimeMinutes)})</p>
        </div>
        <span>{formatPrice(totalWaitPriceTTC)} € TTC</span>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Sous-total attente HT</span>
        <span>{formatPrice(totalWaitPriceHT)} € HT</span>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>TVA (20%)</span>
        <span>{formatPrice(waitingVatAmount)} €</span>
      </div>

      {(waitPriceDay > 0 || waitPriceNight > 0) && (
        <div className="text-xs text-muted-foreground space-y-1 mt-2">
          <p>Détail du calcul :</p>
          {waitPriceDay > 0 && (
            <p className="ml-2">• Jour : {formatPrice(waitPriceDay)} € HT</p>
          )}
          {waitPriceNight > 0 && (
            <p className="ml-2">• Nuit : {formatPrice(waitPriceNight)} € HT</p>
          )}
        </div>
      )}
    </div>
  );
};
