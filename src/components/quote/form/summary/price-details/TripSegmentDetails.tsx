
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface TripSegmentDetailsProps {
  title: string;
  dayKm?: number;
  nightKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  basePrice: number;
  nightRatePercentage?: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
}

export const TripSegmentDetails: React.FC<TripSegmentDetailsProps> = ({
  title,
  dayKm,
  nightKm,
  dayPrice,
  nightPrice,
  basePrice,
  nightRatePercentage,
  nightStartDisplay,
  nightEndDisplay
}) => {
  if (!dayKm && !nightKm) return null;

  return (
    <div className="text-sm">
      {dayKm > 0 && (
        <div>
          <div className="flex justify-between font-medium">
            <span>Segment 1 (Tarif jour)</span>
            <span>{formatPrice(dayPrice)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{nightStartDisplay && nightEndDisplay ? 
                `${nightEndDisplay} - ${nightStartDisplay}` : 
                "Période jour"}</span>
              <span>{Math.round(dayKm * 10) / 10} km</span>
            </div>
            <div className="flex justify-between">
              <span>{Math.round(dayKm * 10) / 10} km × {basePrice.toFixed(2)}€/km HT</span>
              <span>
                {formatPrice(dayPrice)} HT
              </span>
            </div>
          </div>
        </div>
      )}
      
      {nightKm > 0 && (
        <div className="text-sm mt-2">
          <div className="flex justify-between font-medium">
            <span>Segment 2 (Tarif nuit)</span>
            <span>{formatPrice(nightPrice)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{nightStartDisplay && nightEndDisplay ? 
                `${nightStartDisplay} - ${nightEndDisplay}` : 
                "Période nuit"}</span>
              <span>{Math.round(nightKm * 10) / 10} km</span>
            </div>
            <div className="flex justify-between">
              <span>{Math.round(nightKm * 10) / 10} km × {basePrice.toFixed(2)}€/km HT (+{nightRatePercentage}%)</span>
              <span>
                {formatPrice(nightPrice)} HT
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
