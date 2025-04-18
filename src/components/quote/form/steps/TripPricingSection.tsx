
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteDetailsType } from '@/types/quoteForm';
import { TripDetailsDisplay } from './TripDetailsDisplay';
import { PriceSummary } from './PriceSummary';

interface TripPricingSectionProps {
  estimatedDistance: number;
  estimatedDuration: number;
  time: string;
  hasMinDistanceWarning: boolean;
  minDistance: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  quoteDetails: QuoteDetailsType | null;
  isNightRate?: boolean;
  isSunday?: boolean;
  nightHours?: number;
}

export const TripPricingSection: React.FC<TripPricingSectionProps> = ({
  estimatedDistance,
  estimatedDuration,
  time,
  hasMinDistanceWarning,
  minDistance,
  hasReturnTrip,
  returnToSameAddress,
  returnDistance,
  returnDuration,
  hasWaitingTime,
  waitingTimeMinutes,
  quoteDetails,
  isNightRate,
  isSunday,
  nightHours
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Aperçu du trajet</CardTitle>
        </CardHeader>
        <CardContent>
          <TripDetailsDisplay
            estimatedDistance={estimatedDistance}
            estimatedDuration={estimatedDuration}
            time={time}
            hasMinDistanceWarning={hasMinDistanceWarning}
            minDistance={minDistance}
            hasReturnTrip={hasReturnTrip}
            returnToSameAddress={returnToSameAddress}
            returnDistance={returnDistance}
            returnDuration={returnDuration}
            hasWaitingTime={hasWaitingTime}
            waitingTimeMinutes={waitingTimeMinutes}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Détail de la tarification</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceSummary
            quoteDetails={quoteDetails}
            isNightRate={isNightRate}
            isSunday={isSunday}
            nightHours={nightHours}
            hasWaitingTime={hasWaitingTime}
            hasReturnTrip={hasReturnTrip}
          />
        </CardContent>
      </Card>
    </div>
  );
};
