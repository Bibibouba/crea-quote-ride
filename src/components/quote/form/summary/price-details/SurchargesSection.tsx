
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface SurchargesSectionProps {
  quoteDetails: any;
  nightSurcharge?: number;
  sundaySurcharge?: number;
}

export const SurchargesSection: React.FC<SurchargesSectionProps> = ({
  quoteDetails,
  nightSurcharge,
  sundaySurcharge
}) => {
  if (!nightSurcharge && !sundaySurcharge) return null;
  
  return (
    <div className="flex justify-between text-sm pt-1 border-t border-slate-200 mt-1">
      <span>Majorations supplémentaires</span>
      <span>{formatPrice((sundaySurcharge || 0) + (nightSurcharge || 0))}</span>
    </div>
  );
};
