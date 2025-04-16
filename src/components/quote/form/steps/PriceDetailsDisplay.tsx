
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft, Moon, Calendar, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { formatWaitingTime } from '../summary/WaitingTimeDisplay';

interface PriceDetailsDisplayProps {
  quoteDetails: any;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  estimatedDistance: number;
  returnDistance: number;
  isNightRate: boolean;
  isSunday: boolean;
  nightHours: number;
}

export const PriceDetailsDisplay: React.FC<PriceDetailsDisplayProps> = ({
  quoteDetails,
  hasWaitingTime,
  waitingTimeMinutes,
  hasReturnTrip,
  returnToSameAddress,
  estimatedDistance,
  returnDistance,
  isNightRate,
  isSunday,
  nightHours
}) => {
  const formatPrice = (price?: number | string | null) => {
    if (price === undefined || price === null) return "0.0";
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice) || typeof numericPrice !== 'number') return "0.0";
    
    return numericPrice.toFixed(1);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div className="text-sm">
          <div className="flex items-center">
            <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="font-medium">Trajet aller</p>
          </div>
          {quoteDetails?.basePrice && (
            <p className="text-xs text-muted-foreground ml-6 mt-0.5">
              {quoteDetails.hasMinDistanceWarning ? 
                `${quoteDetails.minDistance} km (min.) × ${quoteDetails.basePrice.toFixed(2)}€/km HT` : 
                `${estimatedDistance} km × ${quoteDetails.basePrice.toFixed(2)}€/km HT`}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{formatPrice(quoteDetails?.oneWayPriceHT)}€ HT</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground flex items-center justify-end">
                  {formatPrice(quoteDetails?.oneWayPrice)}€ TTC
                  <InfoIcon className="h-3 w-3 ml-1" />
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">TVA {quoteDetails?.rideVatRate || 10}% sur le transport</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Détail du calcul jour/nuit pour le trajet aller si applicable */}
      {isNightRate && quoteDetails?.dayKm > 0 && quoteDetails?.nightKm > 0 && (
        <div className="ml-6 space-y-1 p-2 bg-secondary/20 rounded-md text-xs">
          <div className="flex justify-between">
            <p>Tarif de jour ({Math.round(quoteDetails.dayKm * 10) / 10} km):</p>
            <p className="font-medium">{formatPrice(quoteDetails.dayPrice)}€ HT</p>
          </div>
          <div className="flex justify-between">
            <p>
              Tarif de nuit ({Math.round(quoteDetails.nightKm * 10) / 10} km) 
              <span className="text-muted-foreground ml-1">
                (+{quoteDetails.nightRatePercentage}%)
              </span>:
            </p>
            <p className="font-medium">{formatPrice(quoteDetails.nightPrice)}€ HT</p>
          </div>
        </div>
      )}
      
      {hasWaitingTime && (
        <div className="flex justify-between">
          <p className="text-sm">Temps d'attente ({formatWaitingTime(waitingTimeMinutes)})</p>
          <div className="text-right">
            <p className="text-sm font-medium">{formatPrice(quoteDetails?.waitingTimePriceHT)}€ HT</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground flex items-center justify-end">
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
      )}
      
      {hasReturnTrip && (
        <div className="flex justify-between items-start">
          <div className="text-sm">
            <div className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="font-medium">Trajet retour</p>
            </div>
            {quoteDetails?.basePrice && (
              <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                {quoteDetails.hasMinDistanceWarning && (returnToSameAddress ? estimatedDistance : returnDistance) < quoteDetails.minDistance ? 
                  `${quoteDetails.minDistance} km (min.) × ${quoteDetails.basePrice.toFixed(2)}€/km HT` : 
                  `${returnToSameAddress ? estimatedDistance : returnDistance} km × ${quoteDetails.basePrice.toFixed(2)}€/km HT`}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatPrice(quoteDetails?.returnPriceHT)}€ HT</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground flex items-center justify-end">
                    {formatPrice(quoteDetails?.returnPrice)}€ TTC
                    <InfoIcon className="h-3 w-3 ml-1" />
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">TVA {quoteDetails?.rideVatRate || 10}% sur le transport</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      
      {(isNightRate || isSunday) && (
        <div className="bg-secondary/20 p-2 rounded-md mt-2 text-sm">
          {isNightRate && quoteDetails?.nightSurcharge && quoteDetails.nightSurcharge > 0 && (
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-1" />
                <span>Majoration tarif de nuit ({Math.round(nightHours * 10) / 10}h)</span>
              </div>
              <span className="font-medium">{formatPrice(quoteDetails?.nightSurcharge)}€</span>
            </div>
          )}
          {isSunday && quoteDetails?.sundaySurcharge && quoteDetails.sundaySurcharge > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Majoration dimanche/jour férié</span>
              </div>
              <span className="font-medium">{formatPrice(quoteDetails?.sundaySurcharge)}€</span>
            </div>
          )}
        </div>
      )}
      
      <Separator className="my-2" />
      
      <div className="flex justify-between font-medium">
        <p>Prix total HT</p>
        <p className="text-lg">{formatPrice(quoteDetails?.totalPriceHT)}€</p>
      </div>
      
      <div className="flex justify-between text-sm">
        <p>TVA</p>
        <p>{formatPrice(quoteDetails?.totalVAT)}€</p>
      </div>
      
      <div className="flex justify-between font-medium pt-2 border-t border-border/30">
        <p>Prix total TTC</p>
        <p className="text-lg">{formatPrice(quoteDetails?.totalPrice)}€</p>
      </div>
    </div>
  );
};
