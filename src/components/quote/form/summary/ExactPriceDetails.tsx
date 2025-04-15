
import React from 'react';

interface ExactPriceDetailsProps {
  dayKm: number;
  nightKm: number;
  dayPrice: number;
  nightPrice: number;
  basePrice: number;
  nightPercentage: number;
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
}

export const ExactPriceDetails: React.FC<ExactPriceDetailsProps> = ({
  dayKm,
  nightKm,
  dayPrice,
  nightPrice,
  basePrice,
  nightPercentage,
  totalHT,
  totalVAT,
  totalTTC
}) => {
  const formatPrice = (price: number) => {
    return Math.round(price).toString();
  };

  return (
    <div className="bg-muted/30 p-4 rounded-md">
      <h3 className="font-medium text-base mb-3">Détails du prix</h3>
      
      <div className="space-y-2 text-sm">
        <p className="font-medium">Trajet aller</p>
        
        {dayKm > 0 && (
          <p>
            Tarif de jour : {Math.round(dayKm)} km × {basePrice.toFixed(2)}€/km HT = {formatPrice(dayPrice)}€ HT
          </p>
        )}
        
        {nightKm > 0 && (
          <p>
            Tarif de Nuit : {Math.round(nightKm)} km × {basePrice.toFixed(2)}€/km HT + {nightPercentage}% = {formatPrice(nightPrice)}€ HT
          </p>
        )}
        
        <div className="pt-2">
          <p className="font-medium">Prix total HT = {formatPrice(totalHT)}€ HT</p>
        </div>
        
        <p>TVA = {formatPrice(totalVAT)}€</p>
        
        <div className="pt-2 font-medium">
          <p>Prix total TTC = {formatPrice(totalTTC)} €</p>
        </div>
      </div>
    </div>
  );
};
