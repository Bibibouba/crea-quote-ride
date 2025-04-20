
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface TotalSectionProps {
  totalPriceHT: number;
  totalPrice: number;
  hasMinDistanceWarning?: boolean;
}

export const TotalSection: React.FC<TotalSectionProps> = ({
  totalPriceHT,
  totalPrice,
  hasMinDistanceWarning
}) => {
  return (
    <>
      <div className="bg-slate-100 border rounded-md p-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-medium">
            <span>Total HT</span>
            <span>{formatPrice(totalPriceHT)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-1 border-t border-slate-200">
            <span>Total TTC</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
      
      {hasMinDistanceWarning && (
        <div className="text-xs text-amber-600">
          <p>* Un supplément pour distance minimale a été appliqué.</p>
        </div>
      )}
    </>
  );
};
