
import React, { useEffect } from 'react';
import { QuoteDetailsType } from '@/types/quoteForm';
import { formatCurrency } from '@/lib/utils';

interface PriceSummaryProps {
  quoteDetails: QuoteDetailsType | null;
  isNightRate?: boolean;
  isSunday?: boolean;
  nightHours?: number;
  hasWaitingTime?: boolean;
  hasReturnTrip?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  quoteDetails,
  isNightRate,
  isSunday,
  nightHours,
  hasWaitingTime,
  hasReturnTrip
}) => {
  // Sécurité supplémentaire pour éviter des erreurs avec des données manquantes
  useEffect(() => {
    if (!quoteDetails) {
      console.log('Aucune donnée de tarification disponible');
    }
  }, [quoteDetails]);

  if (!quoteDetails) {
    return <p className="text-sm">Aucune donnée de tarification disponible</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Tarif de base</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Course aller</span>
            <span>{formatCurrency(quoteDetails.oneWayPriceHT)} HT</span>
          </div>
          
          {hasReturnTrip && (
            <div className="flex justify-between">
              <span>Course retour</span>
              <span>{formatCurrency(quoteDetails.returnPriceHT)} HT</span>
            </div>
          )}
          
          {hasWaitingTime && (
            <div className="flex justify-between">
              <span>Temps d'attente</span>
              <span>{formatCurrency(quoteDetails.waitingTimePriceHT)} HT</span>
            </div>
          )}
        </div>
      </div>
      
      {(isNightRate || isSunday) && (
        <div className="space-y-2">
          <h4 className="font-medium">Suppléments</h4>
          <div className="text-sm space-y-1">
            {isNightRate && (
              <div className="flex justify-between">
                <span>Majoration nuit ({nightHours}h)</span>
                <span>{formatCurrency(quoteDetails.nightSurcharge)} HT</span>
              </div>
            )}
            
            {isSunday && (
              <div className="flex justify-between">
                <span>Majoration dimanche/férié</span>
                <span>{formatCurrency(quoteDetails.sundaySurcharge)} HT</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="font-medium">Total</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Total HT</span>
            <span>{formatCurrency(quoteDetails.totalPriceHT)}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA</span>
            <span>{formatCurrency(quoteDetails.totalVAT)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total TTC</span>
            <span>{formatCurrency(quoteDetails.totalPrice)}</span>
          </div>
        </div>
      </div>
      
      {quoteDetails.hasMinDistanceWarning && (
        <div className="text-xs text-amber-600 mt-2">
          <p>* Un supplément pour distance minimale a été appliqué.</p>
        </div>
      )}
    </div>
  );
};
