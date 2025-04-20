
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

  const formatDistance = (distance: number) => {
    return Math.round(distance * 10) / 10;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div className="text-sm w-full">
          <div className="flex items-center">
            <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="font-medium">Trajet aller</p>
          </div>
          <div className="ml-6 mt-1 space-y-1">
            {quoteDetails?.basePrice && (
              <>
                <p className="text-xs text-muted-foreground">
                  Calcul : {quoteDetails.hasMinDistanceWarning ? quoteDetails.minDistance : formatDistance(estimatedDistance)} km × {quoteDetails.basePrice.toFixed(2)}€/km HT = {formatPrice(quoteDetails?.oneWayPriceHT)}€ HT
                </p>
                <div className="text-xs">
                  <p className="font-medium">{formatPrice(quoteDetails?.oneWayPriceHT)}€ HT</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-muted-foreground flex items-center">
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
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Détail du calcul jour/nuit pour le trajet aller si applicable */}
      {isNightRate && quoteDetails?.dayKm > 0 && quoteDetails?.nightKm > 0 && (
        <div className="ml-6 space-y-1 p-2 bg-secondary/20 rounded-md text-xs">
          <div className="space-y-1">
            <p>Détail du calcul :</p>
            <div className="ml-2">
              <p>• Tarif de jour : {formatDistance(quoteDetails.dayKm)} km × {quoteDetails.basePrice.toFixed(2)}€/km = {formatPrice(quoteDetails.dayPrice)}€ HT</p>
              <p>• Tarif de nuit : {formatDistance(quoteDetails.nightKm)} km × {quoteDetails.basePrice.toFixed(2)}€/km (+{quoteDetails.nightRatePercentage}%) = {formatPrice(quoteDetails.nightPrice)}€ HT</p>
            </div>
          </div>
        </div>
      )}
      
      {hasWaitingTime && (
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
      )}
      
      {hasReturnTrip && (
        <div className="flex justify-between items-start">
          <div className="text-sm w-full">
            <div className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="font-medium">Trajet retour</p>
            </div>
            <div className="ml-6 mt-1 space-y-1">
              {quoteDetails?.basePrice && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Calcul : {quoteDetails.hasMinDistanceWarning && (returnToSameAddress ? estimatedDistance : returnDistance) < quoteDetails.minDistance ? 
                      `${quoteDetails.minDistance} km × ${quoteDetails.basePrice.toFixed(2)}€/km HT` : 
                      `${formatDistance(returnToSameAddress ? estimatedDistance : returnDistance)} km × ${quoteDetails.basePrice.toFixed(2)}€/km HT`} = {formatPrice(quoteDetails?.returnPriceHT)}€ HT
                  </p>
                  <div className="text-xs">
                    <p className="font-medium">{formatPrice(quoteDetails?.returnPriceHT)}€ HT</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-muted-foreground flex items-center">
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
                </>
              )}
            </div>
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
