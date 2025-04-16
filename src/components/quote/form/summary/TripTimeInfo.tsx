
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
  returnNightRateInfo?: NightRateInfo;
  sundayRateInfo?: SundayRateInfo;
  hasReturnTrip?: boolean;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip
}) => {
  // Toujours afficher la jauge si nous avons des informations sur le trajet de nuit
  const shouldDisplayGauge = !!nightRateInfo;
  
  // Utiliser directement les pourcentages calculés s'ils sont disponibles
  const dayPercentage = nightRateInfo?.dayPercentage !== undefined 
    ? nightRateInfo.dayPercentage 
    : nightRateInfo && nightRateInfo.totalKm && nightRateInfo.dayKm
      ? (nightRateInfo.dayKm / nightRateInfo.totalKm) * 100
      : nightRateInfo?.totalHours 
        ? ((nightRateInfo.totalHours - nightRateInfo.nightHours) / nightRateInfo.totalHours) * 100
        : 100;
  
  const nightPercentage = nightRateInfo?.nightPercentage !== undefined
    ? nightRateInfo.nightPercentage
    : 100 - dayPercentage;

  // Pour le retour
  const returnDayPercentage = returnNightRateInfo?.dayPercentage !== undefined 
    ? returnNightRateInfo.dayPercentage 
    : returnNightRateInfo && returnNightRateInfo.totalKm && returnNightRateInfo.dayKm
      ? (returnNightRateInfo.dayKm / returnNightRateInfo.totalKm) * 100
      : returnNightRateInfo?.totalHours 
        ? ((returnNightRateInfo.totalHours - returnNightRateInfo.nightHours) / returnNightRateInfo.totalHours) * 100
        : 100;
  
  const returnNightPercentage = returnNightRateInfo?.nightPercentage !== undefined
    ? returnNightRateInfo.nightPercentage
    : 100 - returnDayPercentage;

  // Format the night hours for display
  const formattedNightHours = nightRateInfo?.nightHours 
    ? formatHours(nightRateInfo.nightHours)
    : '';
  
  const formattedReturnNightHours = returnNightRateInfo?.nightHours 
    ? formatHours(returnNightRateInfo.nightHours)
    : '';
  
  return (
    <div className="bg-secondary/20 p-3 rounded-md mt-2 text-sm space-y-3">
      {shouldDisplayGauge && (
        <>
          {/* Trajet aller */}
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Moon className="h-3 w-3 mr-1" />
              <span>
                {nightRateInfo?.isApplied ? (
                  `Trajet aller: Tarif de nuit appliqué (${nightRateInfo.percentage}% de majoration entre ${nightRateInfo.nightStart} et ${nightRateInfo.nightEnd})`
                ) : (
                  "Trajet aller: Répartition jour/nuit du trajet"
                )}
                {formattedNightHours && <span className="ml-1">- {formattedNightHours} en horaires de nuit</span>}
              </span>
            </div>
            
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
          </div>
          
          {/* Trajet retour */}
          {hasReturnTrip && returnNightRateInfo && (
            <div className="mt-3 pt-3 border-t border-muted">
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <Moon className="h-3 w-3 mr-1" />
                <span>
                  {returnNightRateInfo?.isApplied ? (
                    `Trajet retour: Tarif de nuit appliqué (${returnNightRateInfo.percentage}% de majoration entre ${returnNightRateInfo.nightStart} et ${returnNightRateInfo.nightEnd})`
                  ) : (
                    "Trajet retour: Répartition jour/nuit du trajet"
                  )}
                  {formattedReturnNightHours && <span className="ml-1">- {formattedReturnNightHours} en horaires de nuit</span>}
                </span>
              </div>
              
              <DayNightGauge 
                dayPercentage={returnDayPercentage} 
                nightPercentage={returnNightPercentage}
                dayKm={returnNightRateInfo?.dayKm}
                nightKm={returnNightRateInfo?.nightKm}
              />
              
              {returnNightRateInfo?.isApplied && returnNightRateInfo.dayPrice !== undefined && returnNightRateInfo.nightPrice !== undefined && (
                <div className="flex justify-between text-xs mt-1">
                  <span>{returnNightRateInfo.dayPrice.toFixed(1)}€ (tarif jour)</span>
                  <span>{returnNightRateInfo.nightPrice.toFixed(1)}€ + {returnNightRateInfo.nightSurcharge?.toFixed(1) || '0.0'}€ de majoration (tarif nuit)</span>
                </div>
              )}
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
