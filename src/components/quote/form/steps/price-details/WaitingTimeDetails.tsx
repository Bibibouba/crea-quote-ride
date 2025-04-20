
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { formatWaitingTime } from '../../summary/WaitingTimeDisplay';

interface WaitingTimeDetailsProps {
  quoteDetails: any;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
}

export const WaitingTimeDetails: React.FC<WaitingTimeDetailsProps> = ({
  quoteDetails,
  hasWaitingTime,
  waitingTimeMinutes
}) => {
  const formatPrice = (price?: number | string | null) => {
    if (price === undefined || price === null) return "0.0";
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice) || typeof numericPrice !== 'number') return "0.0";
    return numericPrice.toFixed(1);
  };

  if (!hasWaitingTime) return null;

  return (
    <div className="flex justify-between items-start">
      <div className="text-sm w-full">
        <p className="font-medium">Temps d'attente ({formatWaitingTime(waitingTimeMinutes)})</p>
        <div className="ml-6 mt-1 space-y-1">
          <p className="text-xs text-muted-foreground">
            Calcul : {waitingTimeMinutes} minutes × {((quoteDetails?.waitingTimePriceHT || 0) / waitingTimeMinutes).toFixed(2)}€/min HT = {formatPrice(quoteDetails?.waitingTimePriceHT)}€ HT
          </p>
          <div className="text-xs">
            <p className="font-medium">{formatPrice(quoteDetails?.waitingTimePriceHT)}€ HT</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground flex items-center">
                    {formatPrice(quoteDetails?.waitingTimePrice)}€ TTC
                    <InfoIcon className="h-3 w-3 ml-1" />
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">TVA {quoteDetails?.waitingVatRate || 20}% sur le temps d'attente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
