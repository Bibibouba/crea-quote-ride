
import React from 'react';
import { QuoteDetailsType } from '@/types/quoteForm';

interface PriceSummaryProps {
  quoteDetails: QuoteDetailsType | null;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  hasReturnTrip: boolean;
  showDetailedView: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  quoteDetails,
  hasWaitingTime,
  waitingTimeMinutes,
  hasReturnTrip,
  showDetailedView
}) => {
  if (!quoteDetails) return null;

  return (
    <div className="space-y-4">
      {showDetailedView ? (
        <>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Prix trajet aller</span>
            <span className="text-right font-medium">{quoteDetails.oneWayPrice?.toFixed(2)}€</span>
            
            {hasReturnTrip && (
              <>
                <span className="text-muted-foreground">Prix trajet retour</span>
                <span className="text-right font-medium">{quoteDetails.returnPrice?.toFixed(2)}€</span>
              </>
            )}
            
            {hasWaitingTime && (
              <>
                <span className="text-muted-foreground">
                  Temps d'attente ({waitingTimeMinutes} min)
                </span>
                <span className="text-right font-medium">{quoteDetails.waitingTimePrice?.toFixed(2)}€</span>
              </>
            )}
            
            {quoteDetails.nightSurcharge > 0 && (
              <>
                <span className="text-muted-foreground">Majoration de nuit</span>
                <span className="text-right font-medium">{quoteDetails.nightSurcharge.toFixed(2)}€</span>
              </>
            )}
            
            {quoteDetails.sundaySurcharge > 0 && (
              <>
                <span className="text-muted-foreground">Majoration dimanche/férié</span>
                <span className="text-right font-medium">{quoteDetails.sundaySurcharge.toFixed(2)}€</span>
              </>
            )}
            
            <div className="col-span-2 border-t my-2" />
            
            <span className="text-muted-foreground">Total HT</span>
            <span className="text-right font-medium">{quoteDetails.totalPriceHT?.toFixed(2)}€</span>
            
            <span className="text-muted-foreground">TVA</span>
            <span className="text-right font-medium">{quoteDetails.totalVAT?.toFixed(2)}€</span>
          </div>
        </>
      ) : (
        <div className="text-center">
          <span className="text-2xl font-semibold">{quoteDetails.totalPrice?.toFixed(2)}€ TTC</span>
        </div>
      )}
      
      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-lg font-medium">Total TTC</span>
          <span className="text-right text-lg font-semibold">{quoteDetails.totalPrice?.toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
};
