
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface VATDetailsProps {
  quoteDetails: any;
  hasWaitingTime: boolean;
}

export const VATDetails: React.FC<VATDetailsProps> = ({
  quoteDetails,
  hasWaitingTime
}) => {
  const rideVatRate = 10;  // Taux de TVA pour les trajets: 10%
  const waitingVatRate = 20;  // Taux de TVA pour le temps d'attente: 20%

  // Calculs de TVA
  const oneWayVAT = (quoteDetails.oneWayPrice + quoteDetails.returnPrice) - (quoteDetails.oneWayPriceHT + quoteDetails.returnPriceHT);
  const waitingTimeVAT = quoteDetails.waitingTimePrice - quoteDetails.waitingTimePriceHT;

  return (
    <div className="bg-slate-50 border rounded-md p-3">
      <h3 className="font-semibold text-base mb-2">Détail TVA</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between items-center">
          <span className="flex items-center">Trajets <span className="font-medium ml-1">({rideVatRate}%)</span></span>
          <span>{formatPrice(oneWayVAT)} TVA</span>
        </div>
        
        {hasWaitingTime && (
          <div className="flex justify-between items-center">
            <span className="flex items-center">Temps d'attente <span className="font-medium ml-1">({waitingVatRate}%)</span></span>
            <span>{formatPrice(waitingTimeVAT)} TVA</span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-1 border-t border-slate-200 mt-1">
          <span>Total TVA</span>
          <span>{formatPrice(quoteDetails.totalVAT)}</span>
        </div>
      </div>
    </div>
  );
};
