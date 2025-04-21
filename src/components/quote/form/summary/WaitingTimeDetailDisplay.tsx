
import React from 'react';
import { Clock, Moon, Sun } from 'lucide-react';
import { PriceFormatter } from './PriceFormatter';
import { formatWaitingTime } from './WaitingTimeDisplay';
import { QuoteDetailsType } from '@/types/quoteForm';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface WaitingTimeDetailDisplayProps {
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  quoteDetails?: QuoteDetailsType;
}

export const WaitingTimeDetailDisplay: React.FC<WaitingTimeDetailDisplayProps> = ({
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  quoteDetails
}) => {
  if (!hasWaitingTime) return null;
  
  const dayTime = quoteDetails?.waitTimeDay || 0;
  const nightTime = quoteDetails?.waitTimeNight || 0;
  const dayPrice = quoteDetails?.waitPriceDay || 0;
  const nightPrice = quoteDetails?.waitPriceNight || 0;
  const waitingTimePriceHT = quoteDetails?.waitingTimePriceHT || 0;
  const waitingVATRate = 20; // TVA à 20% pour le temps d'attente
  
  // Calculate VAT for waiting time
  const waitingVAT = waitingTimePriceHT * (waitingVATRate / 100);
  const waitingTimeTTC = waitingTimePriceHT + waitingVAT;
  
  // Si nous n'avons pas de détails jour/nuit, on affiche simplement le temps d'attente global
  if ((!dayTime && !nightTime) || (!dayPrice && !nightPrice)) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="font-medium">Temps d'attente ({formatWaitingTime(waitingTimeMinutes)})</p>
          </div>
          <span>{formatPrice(waitingTimeTTC)} € TTC</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Sous-total HT</span>
          <span>{formatPrice(waitingTimePriceHT)} € HT</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>TVA ({waitingVATRate}%)</span>
          <span>{formatPrice(waitingVAT)} €</span>
        </div>
      </div>
    );
  }
  
  // Sinon, on affiche le détail jour/nuit
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="font-medium">Temps d'attente ({formatWaitingTime(waitingTimeMinutes)})</p>
        </div>
        <span>{formatPrice(waitingTimeTTC)} € TTC</span>
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Sous-total HT</span>
        <span>{formatPrice(waitingTimePriceHT)} € HT</span>
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>TVA ({waitingVATRate}%)</span>
        <span>{formatPrice(waitingVAT)} €</span>
      </div>
      
      {dayTime > 0 && (
        <div className="flex justify-between pl-6 text-sm">
          <div className="flex items-center">
            <Sun className="h-3 w-3 mr-1 flex-shrink-0" />
            <p>Jour ({formatWaitingTime(dayTime)})</p>
          </div>
          <span>{formatPrice(dayPrice)} € HT</span>
        </div>
      )}
      
      {nightTime > 0 && (
        <div className="flex justify-between pl-6 text-sm">
          <div className="flex items-center">
            <Moon className="h-3 w-3 mr-1 flex-shrink-0" />
            <p>Nuit ({formatWaitingTime(nightTime)})</p>
          </div>
          <span>{formatPrice(nightPrice)} € HT</span>
        </div>
      )}
    </div>
  );
};
