
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface VATDetailsProps {
  quoteDetails: any;
  hasWaitingTime: boolean;
}

export const VATDetails: React.FC<VATDetailsProps> = ({
  quoteDetails,
  hasWaitingTime
}) => {
  const rideVatRate = 10;  // Explicitly set ride VAT to 10%
  const waitingVatRate = 20;  // Explicitly set waiting time VAT to 20%

  return (
    <div className="bg-slate-50 border rounded-md p-3">
      <h3 className="font-semibold text-base mb-2">Détail TVA</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between items-center">
          <span>Trajets</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="flex items-center">
                  {rideVatRate}% <InfoIcon className="h-3 w-3 ml-1" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Taux de TVA sur les trajets</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span>{formatPrice((quoteDetails.oneWayPrice + quoteDetails.returnPrice) - (quoteDetails.oneWayPriceHT + quoteDetails.returnPriceHT))}</span>
        </div>
        
        {hasWaitingTime && (
          <div className="flex justify-between items-center">
            <span>Temps d'attente</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex items-center">
                    {waitingVatRate}% <InfoIcon className="h-3 w-3 ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Taux de TVA sur le temps d'attente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>{formatPrice(quoteDetails.waitingTimePrice - quoteDetails.waitingTimePriceHT)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-1 border-t border-slate-200 mt-1">
          <span>Total TVA</span>
          <span>{formatPrice(quoteDetails.totalVAT)}</span>
        </div>
      </div>
    </div>
  );
};
