
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DayNightSplitProps {
  dayKm: number;
  nightKm: number;
  totalKm: number;
  nightRatePercentage: number;
  nightStartTime: string;
  nightEndTime: string;
}

export const DayNightSplit: React.FC<DayNightSplitProps> = ({
  dayKm,
  nightKm,
  totalKm,
  nightRatePercentage,
  nightStartTime,
  nightEndTime
}) => {
  // Calculate percentages for the progress bar
  const dayPercentage = (dayKm / totalKm) * 100;
  const nightPercentage = (nightKm / totalKm) * 100;
  
  // Format kilometer values
  const dayKmFormatted = dayKm.toFixed(1);
  const nightKmFormatted = nightKm.toFixed(1);
  const totalKmFormatted = totalKm.toFixed(1);
  
  return (
    <div className="bg-muted/40 p-3 rounded-md space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium">Répartition Jour/Nuit</h4>
        <span className="text-xs text-muted-foreground">
          Tarif nuit: {nightStartTime} - {nightEndTime} {nightRatePercentage > 0 && `(+${nightRatePercentage}%)`}
        </span>
      </div>
      
      {/* Progress bar visualization */}
      <div className="flex w-full h-7 rounded-md overflow-hidden bg-gray-100 border">
        <div 
          className="bg-yellow-300 flex items-center justify-center text-xs text-yellow-900 relative"
          style={{ width: `${dayPercentage}%` }}
        >
          {dayPercentage > 15 && (
            <div className="flex items-center gap-1 absolute">
              <Sun className="h-3 w-3" />
              <span className="font-medium">{dayKmFormatted} km</span>
            </div>
          )}
        </div>
        <div 
          className="bg-indigo-300 flex items-center justify-center text-xs text-indigo-900 relative"
          style={{ width: `${nightPercentage}%` }}
        >
          {nightPercentage > 15 && (
            <div className="flex items-center gap-1 absolute">
              <Moon className="h-3 w-3" />
              <span className="font-medium">{nightKmFormatted} km</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Labels below the progress bar */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
          <span>{dayKmFormatted} km de jour ({Math.round(dayPercentage)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="h-3.5 w-3.5 text-indigo-400" />
          <span>{nightKmFormatted} km de nuit ({Math.round(nightPercentage)}%)</span>
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground mt-1">
        Distance totale: {totalKmFormatted} km
      </div>
    </div>
  );
};
