
import React from 'react';
import { Moon, Calendar } from 'lucide-react';

interface SurchargesDetailsProps {
  quoteDetails: any;
  isNightRate: boolean;
  isSunday: boolean;
  nightHours: number;
}

export const SurchargesDetails: React.FC<SurchargesDetailsProps> = ({
  quoteDetails,
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

  if (!isNightRate && !isSunday) return null;

  return (
    <div className="bg-secondary/20 p-2 rounded-md mt-2 text-sm">
      {isNightRate && quoteDetails?.nightSurcharge && quoteDetails.nightSurcharge > 0 && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <Moon className="h-4 w-4 mr-1" />
            <span>Majoration tarif de nuit ({Math.round(nightHours * 10) / 10}h)</span>
          </div>
          <span className="font-medium">{formatPrice(quoteDetails?.nightSurcharge)}€</span>
        </div>
      )}
      {isSunday && quoteDetails?.sundaySurcharge && quoteDetails.sundaySurcharge > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Majoration dimanche/jour férié</span>
          </div>
          <span className="font-medium">{formatPrice(quoteDetails?.sundaySurcharge)}€</span>
        </div>
      )}
    </div>
  );
};
