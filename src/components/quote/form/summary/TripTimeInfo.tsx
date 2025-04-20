
import React from 'react';
import { Clock, Sun, Moon, Calendar } from 'lucide-react';
import { DayNightGauge } from './DayNightGauge';
import { NightRateDisplay } from './trip-details/NightRateDisplay';
import { SundayRateInfo } from './trip-details/SundayRateInfo';
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

interface SundayRateInfo {
  isApplied: boolean;
  percentage: number;
}

interface TripTimeInfoProps {
  startTime: string;
  endTime: string;
  nightRateInfo: NightRateInfo;
  returnNightRateInfo?: NightRateInfo;
  sundayRateInfo?: SundayRateInfo;
  hasReturnTrip?: boolean;
  waitingTimeInfo?: {
    waitTimeDay: number;
    waitTimeNight: number;
    waitPriceDay: number;
    waitPriceNight: number;
    totalWaitTime: number;
    waitEndTime?: Date;
  };
  tripEndTime?: Date;
  returnStartTime?: Date;
  returnEndTime?: Date;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip = false,
  waitingTimeInfo,
  tripEndTime,
  returnStartTime,
  returnEndTime
}) => {
  const hasNightRate = nightRateInfo?.isApplied || (returnNightRateInfo?.isApplied ?? false);
  const hasSundayRate = sundayRateInfo?.isApplied ?? false;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Départ: <span className="font-medium ml-1">{startTime}</span>
        </p>
        <p className="flex items-center">
          Arrivée: <span className="font-medium ml-1">{endTime}</span>
        </p>
      </div>
      
      <div className="space-y-3">
        {nightRateInfo && (
          <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Trajet Aller</span>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{startTime}</span>
                <span>-</span>
                <span>{endTime}</span>
              </div>
            </div>
            <NightRateDisplay
              title="Trajet aller"
              isNightRateApplied={nightRateInfo.isApplied}
              nightRatePercentage={nightRateInfo.percentage}
              nightStartDisplay={nightRateInfo.nightStart}
              nightEndDisplay={nightRateInfo.nightEnd}
              nightHours={nightRateInfo.nightHours > 0 ? `${nightRateInfo.nightHours.toFixed(1)}h` : ''}
              dayPercentage={nightRateInfo.dayPercentage || 100 - (nightRateInfo.nightPercentage || 0)}
              nightPercentage={nightRateInfo.nightPercentage || 0}
              dayKm={nightRateInfo.dayKm}
              nightKm={nightRateInfo.nightKm}
              dayPrice={nightRateInfo.dayPrice}
              nightPrice={nightRateInfo.nightPrice}
              nightSurcharge={nightRateInfo.nightSurcharge}
              nightStart={nightRateInfo.nightStart}
              nightEnd={nightRateInfo.nightEnd}
            />
          </div>
        )}
        
        {waitingTimeInfo && waitingTimeInfo.totalWaitTime > 0 && (
          <WaitingTimeGauge
            waitTimeDay={waitingTimeInfo.waitTimeDay}
            waitTimeNight={waitingTimeInfo.waitTimeNight}
            waitPriceDay={waitingTimeInfo.waitPriceDay}
            waitPriceNight={waitingTimeInfo.waitPriceNight}
            totalWaitTime={waitingTimeInfo.totalWaitTime}
            waitStartTime={tripEndTime}
            waitEndTime={waitingTimeInfo.waitEndTime}
          />
        )}
        
        {hasReturnTrip && returnNightRateInfo && (
          <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium">Trajet Retour</span>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{returnStartTime ? format(returnStartTime, 'HH:mm') : '--:--'}</span>
                <span>-</span>
                <span>{returnEndTime ? format(returnEndTime, 'HH:mm') : '--:--'}</span>
              </div>
            </div>
            <NightRateDisplay
              title="Trajet retour"
              isNightRateApplied={returnNightRateInfo.isApplied}
              nightRatePercentage={returnNightRateInfo.percentage}
              nightStartDisplay={returnNightRateInfo.nightStart}
              nightEndDisplay={returnNightRateInfo.nightEnd}
              nightHours={returnNightRateInfo.nightHours > 0 ? `${returnNightRateInfo.nightHours.toFixed(1)}h` : ''}
              dayPercentage={returnNightRateInfo.dayPercentage || 100 - (returnNightRateInfo.nightPercentage || 0)}
              nightPercentage={returnNightRateInfo.nightPercentage || 0}
              dayKm={returnNightRateInfo.dayKm}
              nightKm={returnNightRateInfo.nightKm}
              dayPrice={returnNightRateInfo.dayPrice}
              nightPrice={returnNightRateInfo.nightPrice}
              nightSurcharge={returnNightRateInfo.nightSurcharge}
              nightStart={returnNightRateInfo.nightStart}
              nightEnd={returnNightRateInfo.nightEnd}
            />
          </div>
        )}
        
        {hasSundayRate && sundayRateInfo && (
          <div className="py-2 px-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Majoration dimanche/jour férié</span>
            </div>
            <SundayRateInfo
              isApplied={sundayRateInfo.isApplied}
              percentage={sundayRateInfo.percentage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
