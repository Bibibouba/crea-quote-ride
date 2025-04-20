
import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { formatPrice, formatDistance, calculateTTC } from '@/utils/pricing/priceFormatter';

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
  if (!quoteDetails?.basePrice) return null;
  
  const priceHT = isOneWay ? quoteDetails?.oneWayPriceHT : quoteDetails?.returnPriceHT;
  const priceTTC = isOneWay ? quoteDetails?.oneWayPrice : quoteDetails?.returnPrice;
  const vatRate = quoteDetails?.rideVatRate || 10;

  return (
    <div className="ml-6 mt-1 space-y-1">
      <p className="text-xs text-muted-foreground">
        Calcul : {hasMinDistanceWarning ? quoteDetails.minDistance : formatDistance(estimatedDistance)} km × {quoteDetails.basePrice.toFixed(2)}€/km HT = {formatPrice(priceHT)}€ HT /{formatPrice(priceTTC)}€ TTC
      </p>
      <PriceDisplay 
        priceHT={priceHT}
        priceTTC={priceTTC}
        vatRate={vatRate}
      />
    </div>
  );
};
