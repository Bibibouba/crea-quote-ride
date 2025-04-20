
import React from 'react';
import { ArrowRight, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface TripPriceCalcProps {
  quoteDetails: any;
  hasMinDistanceWarning: boolean;
  estimatedDistance: number;
  isOneWay?: boolean;
}

export const TripPriceCalc: React.FC<TripPriceCalcProps> = ({
  quoteDetails,
  hasMinDistanceWarning,
  estimatedDistance,
  isOneWay = true
}) => {
  const formatPrice = (price?: number | string | null) => {
    if (price === undefined || price === null) return "0.0";
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice) || typeof numericPrice !== 'number') return "0.0";
    return numericPrice.toFixed(1);
  };

  const formatDistance = (distance: number) => {
    return Math.round(distance * 10) / 10;
  };

  return (
    <div className="ml-6 mt-1 space-y-1">
      {quoteDetails?.basePrice && (
        <>
          <p className="text-xs text-muted-foreground">
            Calcul : {hasMinDistanceWarning ? quoteDetails.minDistance : formatDistance(estimatedDistance)} km × {quoteDetails.basePrice.toFixed(2)}€/km HT = {formatPrice(isOneWay ? quoteDetails?.oneWayPriceHT : quoteDetails?.returnPriceHT)}€ HT
          </p>
          <div className="text-xs">
            <p className="font-medium">{formatPrice(isOneWay ? quoteDetails?.oneWayPriceHT : quoteDetails?.returnPriceHT)}€ HT</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground flex items-center">
                    {formatPrice(isOneWay ? quoteDetails?.oneWayPrice : quoteDetails?.returnPrice)}€ TTC
                    <InfoIcon className="h-3 w-3 ml-1" />
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">TVA {quoteDetails?.rideVatRate || 10}% sur le transport</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </div>
  );
};
