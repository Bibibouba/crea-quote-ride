
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Moon, Sun, Clock } from 'lucide-react';

interface WaitingTimeGaugeProps {
  waitTimeDay: number;
  waitTimeNight: number;
  waitPriceDay: number;
  waitPriceNight: number;
  totalWaitTime: number;
  startTimeDisplay?: string;
  endTimeDisplay?: string;
  waitStartTime?: Date;
  waitEndTime?: Date;
}

export const WaitingTimeGauge: React.FC<WaitingTimeGaugeProps> = ({
  waitTimeDay,
  waitTimeNight,
  waitPriceDay,
  waitPriceNight,
  totalWaitTime,
  startTimeDisplay,
  endTimeDisplay,
  waitStartTime,
  waitEndTime
}) => {
  const dayPercentage = (waitTimeDay / totalWaitTime) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Temps d'attente
        </div>
        {startTimeDisplay && endTimeDisplay && (
          <div className="text-muted-foreground">
            {startTimeDisplay} - {endTimeDisplay}
          </div>
        )}
      </div>

      <div className="relative">
        <Progress value={dayPercentage} className="h-8" />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <div className="flex items-center gap-1">
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium">
              {waitTimeDay}min ({waitPriceDay.toFixed(2)}€)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">
              {waitTimeNight}min ({waitPriceNight.toFixed(2)}€)
            </span>
            <Moon className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
