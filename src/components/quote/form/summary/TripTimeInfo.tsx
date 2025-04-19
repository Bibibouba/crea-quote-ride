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
  hasWaitingTime?: boolean;
  waitingTimeMinutes?: number;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip,
  selectedVehicleName = "A",
  hasWaitingTime = false,
  waitingTimeMinutes = 0
}) => {
  const getTimeSegments = () => {
    if (!nightRateInfo) return [];
    
    const segments = [];
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const [nightStartHour, nightStartMinute] = nightRateInfo.nightStart.split(':').map(Number);
    const [nightEndHour, nightEndMinute] = nightRateInfo.nightEnd.split(':').map(Number);

    const calculateTripEndTime = (startHour: number, startMinute: number, totalHours: number) => {
      const endTimeHour = startHour + Math.floor(totalHours);
      const endTimeMinute = startMinute + Math.floor((totalHours % 1) * 60);
      
      const adjustedHour = endTimeHour + Math.floor(endTimeMinute / 60);
      const adjustedMinute = endTimeMinute % 60;
      
      return `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
    };

    const tripEndTime = nightRateInfo.totalHours 
      ? calculateTripEndTime(startHour, startMinute, nightRateInfo.totalHours) 
      : endTime;

    const [tripEndHour, tripEndMinute] = tripEndTime.split(':').map(Number);

    const isStartDuringNight = isWithinNightHours(
      startHour, startMinute, 
      nightStartHour, nightStartMinute, 
      nightEndHour, nightEndMinute
    );
    const isEndDuringNight = isWithinNightHours(
      tripEndHour, tripEndMinute, 
      nightStartHour, nightStartMinute, 
      nightEndHour, nightEndMinute
    );

    if (isStartDuringNight === isEndDuringNight) {
      segments.push({
        start: startTime,
        end: tripEndTime,
        type: isStartDuringNight ? 'night-trip' : 'day-trip',
        label: "Départ"
      });
    } else {
      const transitionTime = isStartDuringNight 
        ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
        : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
      
      segments.push({
        start: startTime,
        end: transitionTime,
        type: isStartDuringNight ? 'night-trip' : 'day-trip',
        label: "Départ"
      });
      
      segments.push({
        start: transitionTime,
        end: tripEndTime,
        type: isStartDuringNight ? 'day-trip' : 'night-trip'
      });
    }

    if (hasWaitingTime && waitingTimeMinutes > 0) {
      const waitingStart = tripEndTime;
      const waitTimeHours = waitingTimeMinutes / 60;
      
      const calcWaitEndHour = parseInt(waitingStart.split(':')[0]) + Math.floor(waitTimeHours);
      const calcWaitEndMinute = parseInt(waitingStart.split(':')[1]) + Math.floor((waitTimeHours % 1) * 60);
      
      const adjustedHour = calcWaitEndHour + Math.floor(calcWaitEndMinute / 60);
      const adjustedMinute = calcWaitEndMinute % 60;
      
      const waitingEnd = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
      
      const isWaitStartNight = isWithinNightHours(
        parseInt(waitingStart.split(':')[0]),
        parseInt(waitingStart.split(':')[1]),
        nightStartHour, nightStartMinute, 
        nightEndHour, nightEndMinute
      );
      
      const isWaitEndNight = isWithinNightHours(
        parseInt(waitingEnd.split(':')[0]),
        parseInt(waitingEnd.split(':')[1]),
        nightStartHour, nightStartMinute, 
        nightEndHour, nightEndMinute
      );
      
      if (isWaitStartNight === isWaitEndNight) {
        segments.push({
          start: waitingStart,
          end: waitingEnd,
          type: isWaitStartNight ? 'night-wait' : 'day-wait',
          label: "Attente"
        });
      } else {
        const transitionTime = isWaitStartNight 
          ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
          : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
        
        segments.push({
          start: waitingStart,
          end: transitionTime,
          type: isWaitStartNight ? 'night-wait' : 'day-wait',
          label: "Attente"
        });
        
        segments.push({
          start: transitionTime,
          end: waitingEnd,
          type: isWaitStartNight ? 'day-wait' : 'night-wait'
        });
      }
    }

    if (hasReturnTrip) {
      const returnStartTime = hasWaitingTime 
        ? segments[segments.length - 1].end 
        : tripEndTime;
      
      const returnEndTime = returnNightRateInfo && returnNightRateInfo.totalHours 
        ? calculateTripEndTime(
            parseInt(returnStartTime.split(':')[0]), 
            parseInt(returnStartTime.split(':')[1]), 
            returnNightRateInfo.totalHours
          ) 
        : endTime;
      
      const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
      const [returnEndHour, returnEndMinute] = returnEndTime.split(':').map(Number);
      
      const isReturnStartNight = isWithinNightHours(
        returnStartHour, returnStartMinute, 
        nightStartHour, nightStartMinute, 
        nightEndHour, nightEndMinute
      );
      
      const isReturnEndNight = isWithinNightHours(
        returnEndHour, returnEndMinute, 
        nightStartHour, nightStartMinute, 
        nightEndHour, nightEndMinute
      );
      
      if (isReturnStartNight === isReturnEndNight) {
        segments.push({
          start: returnStartTime,
          end: returnEndTime,
          type: isReturnStartNight ? 'night-trip' : 'day-trip',
          label: "Retour"
        });
      } else {
        const transitionTime = isReturnStartNight 
          ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
          : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`; 
        
        segments.push({
          start: returnStartTime,
          end: transitionTime,
          type: isReturnStartNight ? 'night-trip' : 'day-trip',
          label: "Retour"
        });
        
        segments.push({
          start: transitionTime,
          end: returnEndTime,
          type: isReturnStartNight ? 'day-trip' : 'night-trip'
        });
      }
    }

    return segments;
  };

  const calculateFinalEndTime = () => {
    if (!hasReturnTrip) {
      return endTime;
    }
    
    const segments = getTimeSegments();
    if (segments.length > 0) {
      return segments[segments.length - 1].end;
    }
    
    return endTime;
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
        
        <div className="flex flex-wrap justify-start gap-3 p-2 mb-2 bg-white/60 rounded border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span className="text-xs">Tarif jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 rounded"></div>
            <span className="text-xs">Attente jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-xs">Attente nuit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span className="text-xs">Tarif nuit</span>
          </div>
        </div>
        
        <TripTimeline
          segments={getTimeSegments()}
          startTime={startTime}
          endTime={calculateFinalEndTime()}
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
