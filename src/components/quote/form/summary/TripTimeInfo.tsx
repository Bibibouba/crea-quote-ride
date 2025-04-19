import React from 'react';
import { Moon, Calendar } from 'lucide-react';
import TripTimeline from './TripTimeline';

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
  const getTimeSegments = () => {
    if (!nightRateInfo) return [];
    
    const segments = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const [nightStartHour, nightStartMinute] = nightRateInfo.nightStart.split(':').map(Number);
    const [nightEndHour, nightEndMinute] = nightRateInfo.nightEnd.split(':').map(Number);

    const isNightStart = startHour >= nightStartHour || startHour < nightEndHour;
    
    segments.push({
      start: startTime,
      end: endTime,
      type: isNightStart ? 'night-trip' : 'day-trip',
      label: "Départ"
    });

    if (hasReturnTrip) {
      segments.push({
        start: endTime,
        end: endTime,
        type: isNightStart ? 'night-wait' : 'day-wait',
      });

      segments.push({
        start: endTime,
        end: "21:51",
        type: 'night-trip',
        label: "Départ retour"
      });
    }

    return segments;
  };

  return (
    <div className="bg-secondary/20 p-3 rounded-md mt-2 text-sm space-y-3">
      <TripTimeline
        segments={getTimeSegments()}
        startTime={startTime}
        endTime={endTime}
        hasReturnTrip={hasReturnTrip}
      />
      
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
