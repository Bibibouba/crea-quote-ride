
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
  return (
    <div className="bg-slate-50 border rounded-md p-3">
      <h3 className="font-semibold text-base mb-2">Détail TVA</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Trajets ({quoteDetails.rideVatRate}%)</span>
          <span>{formatPrice((quoteDetails.oneWayPrice + quoteDetails.returnPrice) - (quoteDetails.oneWayPriceHT + quoteDetails.returnPriceHT))}</span>
        </div>
        
        {hasWaitingTime && (
          <div className="flex justify-between">
            <span>Temps d'attente ({quoteDetails.waitingVatRate}%)</span>
            <span>{formatPrice(quoteDetails.waitingTimePrice - quoteDetails.waitingTimePriceHT)}</span>
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
