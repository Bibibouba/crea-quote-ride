
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TripSegmentDetailsProps {
  title: string;
  dayKm?: number;
  nightKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  basePrice?: number;
  nightRatePercentage?: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
  showVAT?: boolean;
  vatRate?: number;
  vatAmount?: number;
}

export const TripSegmentDetails: React.FC<TripSegmentDetailsProps> = ({
  title,
  dayKm,
  nightKm,
  dayPrice,
  nightPrice,
  basePrice,
  nightRatePercentage,
  nightStartDisplay,
  nightEndDisplay,
  showVAT = true,
  vatRate = 10,
  vatAmount
}) => {
  const totalKm = (dayKm || 0) + (nightKm || 0);
  const totalPriceHT = (dayPrice || 0) + (nightPrice || 0);
  
  // Détermine si on doit afficher le tarif jour ou nuit
  const shouldShowDayRate = (dayKm !== undefined && dayPrice !== undefined && dayKm > 0);
  const shouldShowNightRate = (nightKm !== undefined && nightPrice !== undefined && nightKm > 0);
  
  return (
    <div className="space-y-1 text-sm">
      {basePrice && (
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Prix de base</span>
            <span>{basePrice.toFixed(2)}€/km HT</span>
          </div>
        </div>
      )}

      {shouldShowDayRate && (
        <div className="flex justify-between">
          <div className="flex">
            <span>Tarif jour</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3 w-3 ml-1 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>Portion du trajet effectuée en journée</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col items-end">
            <span>{formatPrice(dayPrice)}€ HT</span>
            <span className="text-xs text-muted-foreground">{dayKm.toFixed(1)} km</span>
          </div>
        </div>
      )}
      
      {shouldShowNightRate && (
        <div className="flex justify-between">
          <div className="flex">
            <span>Tarif nuit</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3 w-3 ml-1 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>Portion du trajet effectuée de nuit ({nightStartDisplay} - {nightEndDisplay})</p>
                  <p>Majoration: {nightRatePercentage}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col items-end">
            <span>{formatPrice(nightPrice)}€ HT</span>
            <span className="text-xs text-muted-foreground">{nightKm.toFixed(1)} km</span>
          </div>
        </div>
      )}
      
      {showVAT && (
        <div className="flex justify-between text-sm pt-1">
          <span>Sous-total HT</span>
          <span>{formatPrice(totalPriceHT)}€ HT</span>
        </div>
      )}
      
      {showVAT && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>TVA ({vatRate}%)</span>
          <span>{formatPrice(vatAmount || (totalPriceHT * vatRate / 100))}€</span>
        </div>
      )}

      {showVAT && (
        <div className="flex justify-between pt-1 font-medium">
          <span>Total TTC</span>
          <span>{formatPrice(totalPriceHT + (vatAmount || (totalPriceHT * vatRate / 100)))}€ TTC</span>
        </div>
      )}
    </div>
  );
};
