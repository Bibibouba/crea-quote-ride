
import React from 'react';
import { TripTimingHeader } from './trip-timing/TripTimingHeader';
import { NightRateSection } from './trip-timing/NightRateSection';
import { SundayRateSection } from './trip-timing/SundayRateSection';
import { WaitingTimeGauge } from './WaitingTimeGauge';
import { format } from 'date-fns';

interface NightRateInfo {
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

interface TripTimeInfoProps {
  startTime: string;
  endTime: string;
  finalTimeDisplay: string;
  nightRateInfo: NightRateInfo;
  returnNightRateInfo?: NightRateInfo;
  sundayRateInfo?: { isApplied: boolean; percentage: number };
  hasReturnTrip?: boolean;
  waitingTimeInfo?: {
    waitTimeDay: number;
    waitTimeNight: number;
    waitPriceDay: number;
    waitPriceNight: number;
    totalWaitTime: number;
    waitStartTime?: Date;
    waitEndTime?: Date;
  };
  tripEndTime?: Date;
  returnStartTime?: Date;
  returnEndTime?: Date;
  finalArrivalTime?: Date;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  finalTimeDisplay,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip = false,
  waitingTimeInfo,
  tripEndTime,
  returnStartTime,
  returnEndTime,
  finalArrivalTime
}) => {
  const formatTimeDisplay = (date?: Date) => {
    if (!date) return '--:--';
    return format(date, 'HH:mm');
  };

  const tripStartDisplay = startTime;
  const tripEndDisplay = formatTimeDisplay(tripEndTime);
  const waitStartDisplay = formatTimeDisplay(tripEndTime);
  const waitEndDisplay = formatTimeDisplay(returnStartTime);
  const returnStartDisplay = formatTimeDisplay(returnStartTime);
  const returnEndDisplay = formatTimeDisplay(returnEndTime);
  
  // Prioritize the provided finalTimeDisplay over calculating from finalArrivalTime
  const displayFinalTime = finalTimeDisplay || formatTimeDisplay(finalArrivalTime);

  return (
    <div>
      <TripTimingHeader 
        startTime={startTime} 
        finalTimeDisplay={displayFinalTime}
      />
      
      <div className="space-y-3">
        {nightRateInfo && (
          <NightRateSection
            startTime={tripStartDisplay}
            endTime={tripEndDisplay}
            title="Trajet Aller"
            nightRateInfo={{
              isApplied: nightRateInfo.isApplied,
              percentage: nightRateInfo.percentage,
              nightStartDisplay: nightRateInfo.nightStart,
              nightEndDisplay: nightRateInfo.nightEnd,
              nightHours: nightRateInfo.nightHours > 0 ? `${nightRateInfo.nightHours.toFixed(1)}h` : '',
              dayPercentage: nightRateInfo.dayPercentage || 100 - (nightRateInfo.nightPercentage || 0),
              nightPercentage: nightRateInfo.nightPercentage || 0,
              dayKm: nightRateInfo.dayKm,
              nightKm: nightRateInfo.nightKm,
              dayPrice: nightRateInfo.dayPrice,
              nightPrice: nightRateInfo.nightPrice,
              nightSurcharge: nightRateInfo.nightSurcharge,
              nightStart: nightRateInfo.nightStart,
              nightEnd: nightRateInfo.nightEnd
            }}
          />
        )}
        
        {waitingTimeInfo && waitingTimeInfo.totalWaitTime > 0 && (
          <WaitingTimeGauge
            waitTimeDay={waitingTimeInfo.waitTimeDay}
            waitTimeNight={waitingTimeInfo.waitTimeNight}
            waitPriceDay={waitingTimeInfo.waitPriceDay}
            waitPriceNight={waitingTimeInfo.waitPriceNight}
            totalWaitTime={waitingTimeInfo.totalWaitTime}
            waitStartTime={tripEndTime}
            waitEndTime={returnStartTime}
            startTimeDisplay={waitStartDisplay}
            endTimeDisplay={waitEndDisplay}
          />
        )}
        
        {hasReturnTrip && returnNightRateInfo && (
          <NightRateSection
            startTime={returnStartDisplay}
            endTime={displayFinalTime}
            title="Trajet Retour"
            nightRateInfo={{
              isApplied: returnNightRateInfo.isApplied,
              percentage: returnNightRateInfo.percentage,
              nightStartDisplay: returnNightRateInfo.nightStart,
              nightEndDisplay: returnNightRateInfo.nightEnd,
              nightHours: returnNightRateInfo.nightHours > 0 ? `${returnNightRateInfo.nightHours.toFixed(1)}h` : '',
              dayPercentage: returnNightRateInfo.dayPercentage || 100 - (returnNightRateInfo.nightPercentage || 0),
              nightPercentage: returnNightRateInfo.nightPercentage || 0,
              dayKm: returnNightRateInfo.dayKm,
              nightKm: returnNightRateInfo.nightKm,
              dayPrice: returnNightRateInfo.dayPrice,
              nightPrice: returnNightRateInfo.nightPrice,
              nightSurcharge: returnNightRateInfo.nightSurcharge,
              nightStart: returnNightRateInfo.nightStart,
              nightEnd: returnNightRateInfo.nightEnd
            }}
          />
        )}
        
        {sundayRateInfo && (
          <SundayRateSection sundayRateInfo={sundayRateInfo} />
        )}
      </div>
    </div>
  );
};
