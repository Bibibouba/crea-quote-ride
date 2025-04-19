
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteDetailsType } from '@/types/quoteForm';
import { TripDetailsDisplay } from './TripDetailsDisplay';
import { PriceSummary } from './PriceSummary';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  // Utilisation d'un ref pour suivre si le composant est monté
  const isMounted = useRef(true);
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  // Cleanup lors du démontage du composant
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleDetailedView = () => {
    setShowDetailedView(prev => !prev);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Aperçu du trajet</CardTitle>
        </CardHeader>
        <CardContent>
          <TripDetailsDisplay
            oneWayDistance={estimatedDistance}
            oneWayDuration={estimatedDuration}
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Détail de la tarification</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1" 
            onClick={toggleDetailedView}
          >
            {showDetailedView ? (
              <>Vue simplifiée <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Vue détaillée <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <PriceSummary
            quoteDetails={quoteDetails}
            hasWaitingTime={hasWaitingTime}
            waitingTimeMinutes={waitingTimeMinutes}
            hasReturnTrip={hasReturnTrip}
            showDetailedView={showDetailedView}
          />
        </CardContent>
      </Card>
    </div>
  );
};
