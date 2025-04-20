
import React from 'react';
import { PriceDisplay } from './PriceDisplay';
import { formatPrice, formatDistance } from '@/utils/pricing/priceFormatter';

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

  return (
    <div className="ml-6 mt-1 space-y-1">
      <p className="text-xs text-muted-foreground">
        Calcul : {hasMinDistanceWarning ? quoteDetails.minDistance : formatDistance(estimatedDistance)} km × {quoteDetails.basePrice.toFixed(2)}€/km HT = {formatPrice(isOneWay ? quoteDetails?.oneWayPriceHT : quoteDetails?.returnPriceHT)}€ HT
      </p>
      <PriceDisplay 
        priceHT={isOneWay ? quoteDetails?.oneWayPriceHT : quoteDetails?.returnPriceHT}
        priceTTC={isOneWay ? quoteDetails?.oneWayPrice : quoteDetails?.returnPrice}
        vatRate={quoteDetails?.rideVatRate}
      />
    </div>
  );
};
