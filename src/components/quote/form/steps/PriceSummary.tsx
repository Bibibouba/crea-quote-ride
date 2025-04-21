
import React, { useEffect } from 'react';
import { QuoteDetailsType } from '@/types/quoteForm';
import { formatCurrency } from '@/lib/utils';
import { PriceDetailsCard } from '../summary/PriceDetailsCard';

interface PriceSummaryProps {
  quoteDetails: QuoteDetailsType | null;
  hasWaitingTime?: boolean;
  hasReturnTrip?: boolean;
  waitingTimeMinutes?: number;
  showDetailedView?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  quoteDetails,
  hasWaitingTime,
  hasReturnTrip,
  waitingTimeMinutes,
  showDetailedView = false
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

  // Si l'affichage détaillé est demandé, utiliser le nouveau composant
  if (showDetailedView) {
    return (
      <PriceDetailsCard
        quoteDetails={quoteDetails}
        hasWaitingTime={hasWaitingTime}
        waitingTimeMinutes={waitingTimeMinutes}
        hasReturnTrip={hasReturnTrip}
      />
    );
  }

  // Sinon, afficher la vue résumée standard
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
      
      <div className="space-y-2">
        <h4 className="font-medium">Total</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Total HT</span>
            <span>{formatCurrency(quoteDetails.totalPriceHT)} HT</span>
          </div>
          <div className="flex justify-between">
            <span>TVA (10%)</span>
            <span>{formatCurrency(quoteDetails.totalVAT)} TTC</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total TTC</span>
            <span>{formatCurrency(quoteDetails.totalPrice)} TTC</span>
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

