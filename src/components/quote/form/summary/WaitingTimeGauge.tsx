
import React from 'react';
import { Clock } from 'lucide-react';
import { DayNightGauge } from './DayNightGauge';

interface WaitingTimeGaugeProps {
  waitTimeDay: number;
  waitTimeNight: number;
  waitPriceDay: number;
  waitPriceNight: number;
  totalWaitTime: number;
}

export const WaitingTimeGauge: React.FC<WaitingTimeGaugeProps> = ({
  waitTimeDay,
  waitTimeNight,
  waitPriceDay,
  waitPriceNight,
  totalWaitTime
}) => {
  if (!totalWaitTime) return null;

  const dayPercentage = (waitTimeDay / totalWaitTime) * 100;
  const nightPercentage = (waitTimeNight / totalWaitTime) * 100;

  return (
    <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">Temps d'attente</span>
      </div>
      <DayNightGauge
        dayPercentage={dayPercentage}
        nightPercentage={nightPercentage}
        dayKm={waitTimeDay}
        nightKm={waitTimeNight}
        isWaitingTime={true}
      />
    </div>
  );
};
