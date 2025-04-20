
import React from 'react';
import { Moon } from 'lucide-react';
import { NightRateDisplay } from '../trip-details/NightRateDisplay';

interface NightRateSectionProps {
  startTime: string;
  endTime: string;
  title: string;
  nightRateInfo: {
    isApplied: boolean;
    percentage: number;
    nightStartDisplay: string;
    nightEndDisplay: string;
    nightHours: string;
    dayPercentage: number;
    nightPercentage: number;
    dayKm?: number;
    nightKm?: number;
    dayPrice?: number;
    nightPrice?: number;
    nightSurcharge?: number;
    nightStart: string;
    nightEnd: string;
  };
}

export const NightRateSection: React.FC<NightRateSectionProps> = ({
  startTime,
  endTime,
  title,
  nightRateInfo
}) => {
  return (
    <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>{startTime}</span>
          <span>-</span>
          <span>{endTime}</span>
        </div>
      </div>
      <NightRateDisplay
        title={title}
        isNightRateApplied={nightRateInfo.isApplied}
        nightRatePercentage={nightRateInfo.percentage}
        nightStartDisplay={nightRateInfo.nightStartDisplay}
        nightEndDisplay={nightRateInfo.nightEndDisplay}
        nightHours={nightRateInfo.nightHours}
        dayPercentage={nightRateInfo.dayPercentage}
        nightPercentage={nightRateInfo.nightPercentage}
        dayKm={nightRateInfo.dayKm}
        nightKm={nightRateInfo.nightKm}
        dayPrice={nightRateInfo.dayPrice}
        nightPrice={nightRateInfo.nightPrice}
        nightSurcharge={nightRateInfo.nightSurcharge}
        nightStart={nightRateInfo.nightStart}
        nightEnd={nightRateInfo.nightEnd}
      />
    </div>
  );
};
