
import React from 'react';
import { Calendar } from 'lucide-react';

interface SundayRateInfoProps {
  isApplied: boolean;
  percentage: number;
}

export const SundayRateInfo: React.FC<SundayRateInfoProps> = ({
  isApplied,
  percentage
}) => {
  if (!isApplied) return null;
  
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Calendar className="h-3 w-3 mr-1" />
      <span>
        Majoration dimanche/jour férié appliquée ({percentage}%)
      </span>
    </div>
  );
};
