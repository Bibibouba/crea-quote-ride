
import React from 'react';
import { Calendar } from 'lucide-react';
import { SundayRateInfo } from '../trip-details/SundayRateInfo';

interface SundayRateSectionProps {
  sundayRateInfo: {
    isApplied: boolean;
    percentage: number;
  };
}

export const SundayRateSection: React.FC<SundayRateSectionProps> = ({
  sundayRateInfo
}) => {
  if (!sundayRateInfo?.isApplied) return null;

  return (
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
  );
};
