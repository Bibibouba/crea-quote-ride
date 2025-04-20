
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { DayNightGauge } from '../DayNightGauge';

interface NightRateInfo {
  isApplied: boolean;
  percentage: number;
  nightStartDisplay: string;
  nightEndDisplay: string;
  nightHours: string;
  dayPercentage?: number;
  nightPercentage?: number;
  dayKm?: number;
  nightKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  nightSurcharge?: number;
  nightStart?: string;
  nightEnd?: string;
}

interface NightRateSectionProps {
  startTime: string;
  endTime: string;
  title: string;
  nightRateInfo: NightRateInfo;
}

export const NightRateSection: React.FC<NightRateSectionProps> = ({
  startTime,
  endTime,
  title,
  nightRateInfo
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          {title}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          {startTime} - {endTime}
        </div>
      </div>

      <div className="relative">
        <DayNightGauge
          dayPercentage={nightRateInfo.dayPercentage || 100 - (nightRateInfo.nightPercentage || 0)}
          nightPercentage={nightRateInfo.nightPercentage || 0}
          dayKm={nightRateInfo.dayKm}
          nightKm={nightRateInfo.nightKm}
          dayPrice={nightRateInfo.dayPrice}
          nightPrice={nightRateInfo.nightPrice}
          showValues={true}
        />
      </div>
    </div>
  );
};
