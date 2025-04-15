
import React from 'react';
import { Moon, Calendar } from 'lucide-react';
import { DayNightGauge } from './DayNightGauge';

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
  if (!nightRateInfo && !sundayRateInfo) return null;
  
  const dayPercentage = nightRateInfo && nightRateInfo.totalKm && nightRateInfo.dayKm
    ? (nightRateInfo.dayKm / nightRateInfo.totalKm) * 100
    : nightRateInfo?.totalHours 
      ? ((nightRateInfo.totalHours - nightRateInfo.nightHours) / nightRateInfo.totalHours) * 100
      : 100;
  
  const nightPercentage = 100 - dayPercentage;
  
  return (
    <div className="bg-secondary/20 p-2 rounded-md mt-2 text-sm space-y-2">
      {nightRateInfo && nightRateInfo.isApplied && (
        <>
          <div className="flex items-center text-xs text-muted-foreground">
            <Moon className="h-3 w-3 mr-1" />
            <span>
              Tarif de nuit appliqué ({nightRateInfo.percentage}% de majoration entre {nightRateInfo.nightStart} et {nightRateInfo.nightEnd})
            </span>
          </div>
          
          {/* Add the gauge here */}
          <DayNightGauge 
            dayPercentage={dayPercentage} 
            nightPercentage={nightPercentage} 
          />
          
          {nightRateInfo.dayKm !== undefined && nightRateInfo.nightKm !== undefined && (
            <div className="flex justify-between text-xs">
              <span>{nightRateInfo.dayKm.toFixed(1)} km (jour)</span>
              <span>{nightRateInfo.nightKm.toFixed(1)} km (nuit)</span>
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
