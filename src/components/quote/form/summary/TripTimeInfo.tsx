
import React from 'react';
import { Moon, Calendar } from 'lucide-react';
import TripTimeline from './TripTimeline';
import { isWithinNightHours } from '@/utils/time/nightTimeChecker';

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
    
    // Convert times to Date objects for easier comparison
    const today = new Date();
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const [nightStartHour, nightStartMinute] = nightRateInfo.nightStart.split(':').map(Number);
    const [nightEndHour, nightEndMinute] = nightRateInfo.nightEnd.split(':').map(Number);

    // Create first segment for outbound trip
    const isStartDuringNight = isWithinNightHours(
      startHour,
      startMinute,
      nightStartHour,
      nightStartMinute,
      nightEndHour,
      nightEndMinute
    );

    segments.push({
      start: startTime,
      end: endTime,
      type: isStartDuringNight ? 'night-trip' : 'day-trip',
      label: "Départ"
    });

    // Add return trip segments if needed
    if (hasReturnTrip) {
      // Add waiting time segment
      segments.push({
        start: endTime,
        end: endTime,
        type: isStartDuringNight ? 'night-wait' : 'day-wait',
      });

      // Add return trip segment
      const isReturnDuringNight = returnNightRateInfo?.isApplied ?? false;
      segments.push({
        start: endTime,
        end: "21:51", // This should be calculated based on return duration
        type: isReturnDuringNight ? 'night-trip' : 'day-trip',
        label: "Retour"
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
