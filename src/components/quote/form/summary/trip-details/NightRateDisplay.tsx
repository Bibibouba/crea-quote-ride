
import React from 'react';
import { Moon } from 'lucide-react';
import { DayNightGauge } from '../DayNightGauge';
import { formatPrice } from '@/utils/pricing/priceFormatter';

interface NightRateDisplayProps {
  title: string;
  isNightRateApplied: boolean;
  nightRatePercentage: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
  nightHours: string;
  dayPercentage: number;
  nightPercentage: number;
  dayKm?: number;
  nightKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  nightSurcharge?: number;
  nightStart: string;
  nightEnd: string;
}

export const NightRateDisplay: React.FC<NightRateDisplayProps> = ({
  title,
  isNightRateApplied,
  nightRatePercentage,
  nightStartDisplay,
  nightEndDisplay,
  nightHours,
  dayPercentage,
  nightPercentage,
  dayKm,
  nightKm,
  dayPrice,
  nightPrice,
  nightSurcharge,
  nightStart,
  nightEnd
}) => {
  return (
    <div>
      <div className="flex items-center text-xs text-muted-foreground mb-1">
        <Moon className="h-3 w-3 mr-1" />
        <span>
          {isNightRateApplied ? (
            `${title}: Tarif de nuit appliqué (${nightRatePercentage}% de majoration entre ${nightStart} et ${nightEnd})`
          ) : (
            `${title}: Répartition jour/nuit du trajet`
          )}
          {nightHours && <span className="ml-1">- {nightHours} en horaires de nuit</span>}
        </span>
      </div>
      
      <DayNightGauge 
        dayPercentage={dayPercentage} 
        nightPercentage={nightPercentage}
        dayKm={dayKm}
        nightKm={nightKm}
      />
      
      {isNightRateApplied && dayPrice !== undefined && nightPrice !== undefined && (
        <div className="flex justify-between text-xs mt-1">
          <span>{dayPrice.toFixed(1)}€ (tarif jour)</span>
          <span>{nightPrice.toFixed(1)}€ + {nightSurcharge?.toFixed(1) || '0.0'}€ de majoration (tarif nuit)</span>
        </div>
      )}
    </div>
  );
};
