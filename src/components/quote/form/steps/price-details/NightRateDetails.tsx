
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

  // Calculate the night price with the percentage directly applied
  const basePrice = quoteDetails.basePrice || 0;
  const nightRatePercentage = quoteDetails.nightRatePercentage || 0;
  const nightPricePerKm = basePrice * (1 + nightRatePercentage / 100);

  return (
    <div className="ml-6 space-y-1 p-2 bg-secondary/20 rounded-md text-xs">
      <div className="space-y-1">
        <p>Détail du calcul :</p>
        <div className="ml-2">
          <p>• Tarif de jour : {formatDistance(quoteDetails.dayKm)} km × {quoteDetails.basePrice.toFixed(2)}€/km = {formatPrice(quoteDetails.dayPrice)}€ HT</p>
          <p>• Tarif de nuit : {formatDistance(quoteDetails.nightKm)} km × {nightPricePerKm.toFixed(2)}€/km = {formatPrice(quoteDetails.nightPrice)}€ HT</p>
        </div>
      </div>
    </div>
  );
};
