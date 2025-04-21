
import React from 'react';

interface NightRateDetailsProps {
  quoteDetails: any;
  isNightRate: boolean;
}

export const NightRateDetails: React.FC<NightRateDetailsProps> = ({
  quoteDetails,
  isNightRate
}) => {
  const formatDistance = (distance: number) => {
    return Math.round(distance * 10) / 10;
  };

  const formatPrice = (price?: number | string | null) => {
    if (price === undefined || price === null) return "0.0";
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice) || typeof numericPrice !== 'number') return "0.0";
    return numericPrice.toFixed(1);
  };

  if (!isNightRate || !quoteDetails?.dayKm || !quoteDetails?.nightKm) {
    return null;
  }

  // Vérifier si nous avons des km de jour ou de nuit
  const hasDayKm = quoteDetails.dayKm > 0;
  const hasNightKm = quoteDetails.nightKm > 0;
  
  // Ignorer si aucun tarif applicable
  if (!hasDayKm && !hasNightKm) return null;
  
  // Calculate the night price with the percentage directly applied
  const basePrice = quoteDetails.basePrice || 0;
  const nightRatePercentage = quoteDetails.nightRatePercentage || 0;
  const nightPricePerKm = basePrice * (1 + nightRatePercentage / 100);
  
  // Calculate the correct night price with surcharge
  const nightKm = quoteDetails.nightKm;
  const nightBasePriceTotal = nightKm * basePrice;
  const nightPriceWithSurcharge = nightBasePriceTotal * (1 + nightRatePercentage / 100);

  return (
    <div className="ml-6 space-y-1 p-2 bg-secondary/20 rounded-md text-xs">
      <div className="space-y-1">
        <p>Détail du calcul :</p>
        <div className="ml-2">
          {hasDayKm && (
            <p>• Tarif de jour : {formatDistance(quoteDetails.dayKm)} km × {basePrice.toFixed(2)}€/km = {formatPrice(quoteDetails.dayPrice)}€ HT</p>
          )}
          {hasNightKm && (
            <p>• Tarif de nuit : {formatDistance(nightKm)} km × {basePrice.toFixed(2)}€/km = {formatPrice(nightBasePriceTotal)}€ + {nightRatePercentage}% = {formatPrice(nightPriceWithSurcharge)}€ HT</p>
          )}
        </div>
      </div>
    </div>
  );
};
