
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Sun, Moon } from 'lucide-react';

interface DayNightGaugeProps {
  dayPercentage: number;
  nightPercentage: number;
}

export const DayNightGauge: React.FC<DayNightGaugeProps> = ({ 
  dayPercentage, 
  nightPercentage 
}) => {
  const formattedDayPercentage = Math.round(dayPercentage);
  const formattedNightPercentage = Math.round(nightPercentage);

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <Sun className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-sm font-medium">Jour ({formattedDayPercentage}%)</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">Nuit ({formattedNightPercentage}%)</span>
          <Moon className="h-4 w-4 text-blue-600 ml-1" />
        </div>
      </div>
      
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 bg-amber-400 transition-all duration-300"
          style={{ width: `${dayPercentage}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-blue-500 transition-all duration-300"
          style={{ width: `${nightPercentage}%` }}
        />
      </div>
    </div>
  );
};
