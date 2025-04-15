
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Sun, Moon } from 'lucide-react';

interface DayNightGaugeProps {
  dayPercentage: number;
  nightPercentage: number;
  dayKm?: number;
  nightKm?: number;
}

export const DayNightGauge: React.FC<DayNightGaugeProps> = ({ 
  dayPercentage, 
  nightPercentage,
  dayKm,
  nightKm
}) => {
  const formattedDayPercentage = Math.round(dayPercentage);
  const formattedNightPercentage = Math.round(nightPercentage);

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <Sun className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-sm font-medium">
            Jour ({formattedDayPercentage}%)
            {dayKm !== undefined && <span className="text-xs ml-1">({dayKm.toFixed(1)} km)</span>}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            Nuit ({formattedNightPercentage}%)
            {nightKm !== undefined && <span className="text-xs ml-1">({nightKm.toFixed(1)} km)</span>}
          </span>
          <Moon className="h-4 w-4 text-blue-600 ml-1" />
        </div>
      </div>
      
      <div className="relative h-5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 bg-amber-400 transition-all duration-300 flex items-center justify-center text-xs font-medium text-amber-900"
          style={{ width: `${dayPercentage}%` }}
        >
          {formattedDayPercentage > 15 && `${formattedDayPercentage}%`}
        </div>
        <div
          className="absolute inset-y-0 right-0 bg-blue-500 transition-all duration-300 flex items-center justify-center text-xs font-medium text-white"
          style={{ width: `${nightPercentage}%` }}
        >
          {formattedNightPercentage > 15 && `${formattedNightPercentage}%`}
        </div>
      </div>
    </div>
  );
};
