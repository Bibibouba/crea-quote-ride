
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface PriceDisplayProps {
  priceHT: number | null;
  priceTTC: number | null;
  vatRate?: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceHT,
  priceTTC,
  vatRate = 10
}) => {
  return (
    <div className="text-xs">
      <p className="font-medium">
        {formatPrice(priceTTC)}€ TTC
      </p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-muted-foreground flex items-center">
              {formatPrice(priceHT)}€ HT
              <InfoIcon className="h-3 w-3 ml-1" />
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">TVA {vatRate}% sur le transport</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
