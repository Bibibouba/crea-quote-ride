
import React from 'react';
import { Moon, Calendar } from 'lucide-react';
import { DayNightGauge } from './DayNightGauge';
import { formatHours } from '@/lib/formatHours';

export interface NightRateInfo {
  isApplied: boolean;
  percentage: number;
  nightHours: number;
  totalHours: number;
  nightStart: string;
  nightEnd: string;
  nightSurcharge?: number;
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  dayPercentage?: number;
  nightPercentage?: number;
}

export interface SundayRateInfo {
  isApplied: boolean;
  percentage: number;
}

interface TripTimeInfoProps {
  startTime: string;
  endTime: string;
  nightRateInfo?: NightRateInfo;
  sundayRateInfo?: SundayRateInfo;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  sundayRateInfo
}) => {
  // Toujours afficher la jauge si nous avons des informations sur le trajet de nuit
  const shouldDisplayGauge = !!nightRateInfo;
  
  // Calculate day and night percentages - utiliser les pourcentages si fournis, sinon calculer
  const dayPercentage = nightRateInfo?.dayPercentage 
    ? nightRateInfo.dayPercentage 
    : nightRateInfo && nightRateInfo.totalKm && nightRateInfo.dayKm
      ? (nightRateInfo.dayKm / nightRateInfo.totalKm) * 100
      : nightRateInfo?.totalHours 
        ? ((nightRateInfo.totalHours - nightRateInfo.nightHours) / nightRateInfo.totalHours) * 100
        : 100;
  
  const nightPercentage = nightRateInfo?.nightPercentage 
    ? nightRateInfo.nightPercentage 
    : 100 - dayPercentage;

  // Format the night hours for display
  const formattedNightHours = nightRateInfo?.nightHours 
    ? formatHours(nightRateInfo.nightHours)
    : '';
  
  return (
    <div className="bg-secondary/20 p-3 rounded-md mt-2 text-sm space-y-3">
      {shouldDisplayGauge && (
        <>
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Moon className="h-3 w-3 mr-1" />
            <span>
              {nightRateInfo?.isApplied ? (
                `Tarif de nuit appliqué (${nightRateInfo.percentage}% de majoration entre ${nightRateInfo.nightStart} et ${nightRateInfo.nightEnd})`
              ) : (
                "Répartition jour/nuit du trajet"
              )}
              {formattedNightHours && <span className="ml-1">- {formattedNightHours} en horaires de nuit</span>}
            </span>
          </div>
          
          {/* Toujours afficher la jauge si nous avons des infos sur le trajet */}
          <DayNightGauge 
            dayPercentage={dayPercentage} 
            nightPercentage={nightPercentage}
            dayKm={nightRateInfo?.dayKm}
            nightKm={nightRateInfo?.nightKm}
          />
          
          {nightRateInfo?.isApplied && nightRateInfo.dayPrice !== undefined && nightRateInfo.nightPrice !== undefined && (
            <div className="flex justify-between text-xs mt-1">
              <span>{nightRateInfo.dayPrice.toFixed(1)}€ (tarif jour)</span>
              <span>{nightRateInfo.nightPrice.toFixed(1)}€ + {nightRateInfo.nightSurcharge?.toFixed(1) || '0.0'}€ de majoration (tarif nuit)</span>
            </div>
          )}
        </>
      )}
      
      {sundayRateInfo && sundayRateInfo.isApplied && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Majoration dimanche/jour férié appliquée ({sundayRateInfo.percentage}%)
          </span>
        </div>
      )}
    </div>
  );
};
