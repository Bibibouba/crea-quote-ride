
import React from 'react';
import { Moon, Sun, GanttChart } from 'lucide-react';
import { PriceFormatter } from './PriceFormatter';

export interface NightRateInfo {
  isApplied: boolean;
  percentage: number;
  nightHours?: number;
  totalHours?: number;
  nightStart?: string;
  nightEnd?: string;
  nightSurcharge?: number;
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
}

export interface SundayRateInfo {
  isApplied: boolean;
  percentage: number;
}

interface TripTimeInfoProps {
  startTime?: string;
  endTime?: string;
  nightRateInfo?: NightRateInfo;
  sundayRateInfo?: SundayRateInfo;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  sundayRateInfo
}) => {
  if (!nightRateInfo?.isApplied && !sundayRateInfo?.isApplied) {
    return null;
  }

  // Vérifier si la majoration de nuit est réellement applicable
  // (il existe une portion de nuit et des km de nuit positifs)
  const hasNightRate = nightRateInfo?.isApplied && 
                      nightRateInfo.nightHours && 
                      nightRateInfo.nightHours > 0 && 
                      nightRateInfo.nightKm && 
                      nightRateInfo.nightKm > 0;

  return (
    <div className="space-y-2">
      {hasNightRate && (
        <div className="bg-muted/40 p-2 rounded-md space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <GanttChart className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-medium">Détail tarif jour/nuit</p>
            {nightRateInfo.nightStart && nightRateInfo.nightEnd && (
              <span className="text-xs text-muted-foreground ml-auto">
                Tarif nuit : {nightRateInfo.nightStart} - {nightRateInfo.nightEnd} (+{nightRateInfo.percentage}%)
              </span>
            )}
          </div>
          
          {nightRateInfo.dayKm !== undefined && nightRateInfo.dayPrice !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Sun className="h-3.5 w-3.5 text-yellow-500" />
              <span>Tarif jour : {nightRateInfo.dayKm} km × <PriceFormatter price={nightRateInfo.dayKm > 0 ? nightRateInfo.dayPrice / nightRateInfo.dayKm : 0} /></span>
              <span className="ml-auto font-medium">
                <PriceFormatter price={nightRateInfo.dayPrice} />
              </span>
            </div>
          )}
          
          {nightRateInfo.nightKm !== undefined && nightRateInfo.nightKm > 0 && nightRateInfo.nightPrice !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Moon className="h-3.5 w-3.5 text-indigo-400" />
              <span>
                Tarif nuit : {nightRateInfo.nightKm} km × <PriceFormatter price={nightRateInfo.dayKm && nightRateInfo.dayKm > 0 ? nightRateInfo.dayPrice / nightRateInfo.dayKm : 0} /> 
                {nightRateInfo.percentage > 0 && ` (+${nightRateInfo.percentage}%)`}
              </span>
              <span className="ml-auto font-medium">
                <PriceFormatter price={nightRateInfo.nightPrice} />
              </span>
            </div>
          )}
          
          {nightRateInfo.nightHours !== undefined && nightRateInfo.totalHours !== undefined && (
            <div className="mt-1 text-xs text-muted-foreground">
              Durée estimée: {Math.round((nightRateInfo.totalHours - nightRateInfo.nightHours) * 10) / 10}h de jour, 
              {Math.round(nightRateInfo.nightHours * 10) / 10}h de nuit
            </div>
          )}
        </div>
      )}
      
      {sundayRateInfo?.isApplied && (
        <div className="bg-muted/40 p-2 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sm font-medium">Majoration dimanche/férié</span>
            <span className="text-xs text-muted-foreground ml-auto">
              +{sundayRateInfo.percentage}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
