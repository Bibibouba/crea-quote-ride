
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { TripPriceCalc } from './price-details/TripPriceCalc';
import { NightRateDetails } from './price-details/NightRateDetails';
import { WaitingTimeDetails } from './price-details/WaitingTimeDetails';
import { SurchargesDetails } from './price-details/SurchargesDetails';

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
        <div className="text-sm w-full">
          <div className="flex items-center">
            <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="font-medium">Trajet aller</p>
          </div>
          <TripPriceCalc 
            quoteDetails={quoteDetails}
            hasMinDistanceWarning={quoteDetails?.hasMinDistanceWarning}
            estimatedDistance={estimatedDistance}
            isOneWay={true}
          />
        </div>
      </div>
      
      <NightRateDetails 
        quoteDetails={quoteDetails} 
        isNightRate={isNightRate} 
      />
      
      <WaitingTimeDetails 
        quoteDetails={quoteDetails}
        hasWaitingTime={hasWaitingTime}
        waitingTimeMinutes={waitingTimeMinutes}
      />
      
      {hasReturnTrip && (
        <div className="flex justify-between items-start">
          <div className="text-sm w-full">
            <div className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="font-medium">Trajet retour</p>
            </div>
            <TripPriceCalc 
              quoteDetails={quoteDetails}
              hasMinDistanceWarning={quoteDetails?.hasMinDistanceWarning}
              estimatedDistance={returnToSameAddress ? estimatedDistance : returnDistance}
              isOneWay={false}
            />
          </div>
        </div>
      )}
      
      <SurchargesDetails 
        quoteDetails={quoteDetails}
        isNightRate={isNightRate}
        isSunday={isSunday}
        nightHours={nightHours}
      />
      
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
