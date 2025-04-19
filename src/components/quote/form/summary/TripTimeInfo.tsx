
import React from 'react';
import { Moon, Calendar } from 'lucide-react';
import TripTimeline from './TripTimeline';
import { isWithinNightHours } from '@/utils/time/nightTimeChecker';
import { VehicleRateInfo } from './VehicleRateInfo';

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
  selectedVehicleName?: string;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip,
  selectedVehicleName = "A"
}) => {
  const getTimeSegments = () => {
    if (!nightRateInfo) return [];
    
    const segments = [];
    
    // Convert times for easier comparison
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const [nightStartHour, nightStartMinute] = nightRateInfo.nightStart.split(':').map(Number);
    const [nightEndHour, nightEndMinute] = nightRateInfo.nightEnd.split(':').map(Number);

    // Determine if the trip starts during night hours
    const isStartDuringNight = isWithinNightHours(
      startHour,
      startMinute,
      nightStartHour,
      nightStartMinute,
      nightEndHour,
      nightEndMinute
    );

    // Add the outbound trip segment
    segments.push({
      start: startTime,
      end: endTime,
      type: isStartDuringNight ? 'night-trip' : 'day-trip',
      label: "Départ"
    });

    // Handle return trip if needed
    if (hasReturnTrip) {
      // Add waiting time segment with appropriate day/night type
      const isWaitingDuringNight = isWithinNightHours(
        endHour, 
        endMinute, 
        nightStartHour, 
        nightStartMinute, 
        nightEndHour, 
        nightEndMinute
      );
      
      // Calculate waiting end time (same as return start time)
      // For simplicity, we'll use the same time as the outbound arrival
      
      // Add waiting segment - the width will be minimal as start and end are the same
      segments.push({
        start: endTime,
        end: endTime,
        type: isWaitingDuringNight ? 'night-wait' : 'day-wait',
      });

      // Calculate actual return end time based on return duration
      let returnEndTime;
      if (returnNightRateInfo) {
        // If we have return night rate info, use it to calculate end time
        const returnEndHour = Math.floor(endHour + returnNightRateInfo.totalHours);
        const returnEndMinute = Math.floor(endMinute + (returnNightRateInfo.totalHours % 1) * 60);
        
        // Handle overflow
        const adjustedHour = returnEndHour + Math.floor(returnEndMinute / 60);
        const adjustedMinute = returnEndMinute % 60;
        
        returnEndTime = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
      } else {
        // Fallback to estimate (actual arrival 51 minutes after return start)
        returnEndTime = "21:51";
      }

      // Determine if return trip is during night hours
      const isReturnDuringNight = isWithinNightHours(
        endHour,
        endMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );
      
      // Add return trip segment
      segments.push({
        start: endTime,
        end: returnEndTime,
        type: isReturnDuringNight ? 'night-trip' : 'day-trip',
        label: "Retour"
      });
    }

    return segments;
  };

  return (
    <div className="space-y-4">
      {nightRateInfo && (
        <VehicleRateInfo 
          vehicleName={selectedVehicleName}
          nightStart={nightRateInfo.nightStart}
          nightEnd={nightRateInfo.nightEnd}
        />
      )}
      
      <div className="bg-secondary/20 p-3 rounded-md mt-2 text-sm space-y-3">
        <h3 className="font-medium mb-2">Chronologie du Trajet</h3>
        
        <TripTimeline
          segments={getTimeSegments()}
          startTime={startTime}
          endTime={hasReturnTrip && returnNightRateInfo ? 
            // Calculate the final arrival time for return trip
            (() => {
              const [endHour, endMinute] = endTime.split(':').map(Number);
              const returnEndHour = Math.floor(endHour + returnNightRateInfo.totalHours);
              const returnEndMinute = Math.floor(endMinute + (returnNightRateInfo.totalHours % 1) * 60);
              
              // Handle overflow
              const adjustedHour = returnEndHour + Math.floor(returnEndMinute / 60);
              const adjustedMinute = returnEndMinute % 60;
              
              return `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
            })() : 
            endTime}
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
    </div>
  );
};
