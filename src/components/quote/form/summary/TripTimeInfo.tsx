
import React from 'react';
import { Moon, Calendar } from 'lucide-react';

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
  sundaySurcharge?: number;
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
  if (!nightRateInfo?.isApplied && !sundayRateInfo?.isApplied) {
    return null;
  }

  return (
    <div className="space-y-2">
      {nightRateInfo?.isApplied && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Moon className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-indigo-800">
                Tarif de nuit
              </p>
              <p className="text-xs text-indigo-700 mt-1">
                <span className="font-medium">
                  {Math.round(nightRateInfo.nightHours * 10) / 10}h
                </span> de trajet en tarif de nuit (+{nightRateInfo.percentage}%)
                {nightRateInfo.nightStart && nightRateInfo.nightEnd && (
                  <span className="block mt-1">
                    Tarif de nuit de {nightRateInfo.nightStart} à {nightRateInfo.nightEnd}
                  </span>
                )}
              </p>
              
              {nightRateInfo.dayKm !== undefined && 
               nightRateInfo.nightKm !== undefined && 
               nightRateInfo.totalKm !== undefined && (
                <div className="mt-2 text-xs text-indigo-700 border-t border-indigo-100 pt-2">
                  <p className="flex justify-between">
                    <span>Trajet en journée:</span>
                    <span className="font-medium">{nightRateInfo.dayKm} km</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Trajet de nuit:</span>
                    <span className="font-medium">{nightRateInfo.nightKm} km</span>
                  </p>
                  {nightRateInfo.dayPrice !== undefined && nightRateInfo.nightPrice !== undefined && (
                    <>
                      <p className="flex justify-between mt-1">
                        <span>Prix journée:</span>
                        <span className="font-medium">{nightRateInfo.dayPrice.toFixed(2)}€</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Prix nuit (majoré):</span>
                        <span className="font-medium">{nightRateInfo.nightPrice.toFixed(2)}€</span>
                      </p>
                      {nightRateInfo.nightSurcharge !== undefined && (
                        <p className="flex justify-between mt-1 font-medium text-indigo-800">
                          <span>Supplément nuit:</span>
                          <span>+{nightRateInfo.nightSurcharge.toFixed(2)}€</span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sundayRateInfo?.isApplied && (
        <div className="bg-orange-50 border border-orange-100 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Majoration dimanche/jour férié
              </p>
              <p className="text-xs text-orange-700 mt-1">
                Majoration de {sundayRateInfo.percentage}% sur l'ensemble du trajet
              </p>
              {sundayRateInfo.sundaySurcharge !== undefined && (
                <p className="text-xs font-medium text-orange-800 mt-1">
                  Supplément: +{sundayRateInfo.sundaySurcharge.toFixed(2)}€
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
