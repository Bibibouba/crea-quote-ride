
import React from 'react';
import { Clock } from 'lucide-react';
import { DayNightGauge } from './DayNightGauge';
import { format } from 'date-fns';

interface WaitingTimeGaugeProps {
  waitTimeDay: number;
  waitTimeNight: number;
  waitPriceDay: number;
  waitPriceNight: number;
  totalWaitTime: number;
  waitStartTime?: Date;
  waitEndTime?: Date;
  startTimeDisplay?: string;
  endTimeDisplay?: string;
}

export const WaitingTimeGauge: React.FC<WaitingTimeGaugeProps> = ({
  waitTimeDay,
  waitTimeNight,
  waitPriceDay,
  waitPriceNight,
  totalWaitTime,
  waitStartTime,
  waitEndTime,
  startTimeDisplay,
  endTimeDisplay
}) => {
  // Vérification supplémentaire pour s'assurer que la jauge s'affiche
  console.log('WaitingTimeGauge rendered with:', {
    waitTimeDay,
    waitTimeNight,
    totalWaitTime,
    waitStartTime,
    waitEndTime,
    startTimeDisplay,
    endTimeDisplay
  });

  // Pas de rendu si pas de temps d'attente
  if (!totalWaitTime || totalWaitTime <= 0) return null;

  // Calcul des pourcentages pour la jauge
  const dayPercentage = Math.max(0, Math.min(100, (waitTimeDay / totalWaitTime) * 100));
  const nightPercentage = Math.max(0, Math.min(100, (waitTimeNight / totalWaitTime) * 100));

  // Vérifier si on a un cas de 100% jour / 0% nuit
  const isFullDayRate = nightPercentage < 1 || !waitTimeNight || waitTimeNight <= 0;

  // S'assurer que les pourcentages sont valides
  console.log('Calculated percentages for waiting time gauge:', { 
    waitTimeDay,
    waitTimeNight,
    totalWaitTime,
    dayPercentage, 
    nightPercentage, 
    isFullDayRate, 
    total: dayPercentage + nightPercentage,
    startTimeDisplay,
    endTimeDisplay
  });

  // Utiliser les valeurs pré-formatées si disponibles, sinon formater les dates
  const displayStartTime = startTimeDisplay || (waitStartTime ? format(waitStartTime, 'HH:mm') : '');
  const displayEndTime = endTimeDisplay || (waitEndTime ? format(waitEndTime, 'HH:mm') : '');

  return (
    <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200 mt-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">Temps d'attente</span>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>{displayStartTime}</span>
          <span>-</span>
          <span>{displayEndTime}</span>
        </div>
      </div>
      <DayNightGauge
        dayPercentage={isFullDayRate ? 100 : Math.round(dayPercentage)}
        nightPercentage={isFullDayRate ? 0 : Math.round(nightPercentage)}
        dayKm={waitTimeDay}
        nightKm={waitTimeNight}
        isWaitingTime={true}
      />
      {(waitPriceDay > 0 || waitPriceNight > 0) && (
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <span>{Math.round(waitTimeDay)} min (jour)</span>
          <span>{isFullDayRate ? '0' : Math.round(waitTimeNight)} min (nuit)</span>
        </div>
      )}
    </div>
  );
};
