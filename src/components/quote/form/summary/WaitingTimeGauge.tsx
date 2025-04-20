
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
  // Vérification supplémentaire pour s'assurer que la jauge s'affiche
  console.log('WaitingTimeGauge rendered with:', {
    waitTimeDay,
    waitTimeNight,
    totalWaitTime
  });

  // Pas de rendu si pas de temps d'attente
  if (!totalWaitTime || totalWaitTime <= 0) return null;

  // Calcul des pourcentages pour la jauge
  const dayPercentage = Math.max(0, Math.min(100, (waitTimeDay / totalWaitTime) * 100));
  const nightPercentage = Math.max(0, Math.min(100, (waitTimeNight / totalWaitTime) * 100));

  // Vérifier si on a un cas de 100% jour / 0% nuit
  const isFullDayRate = nightPercentage === 0 || !waitTimeNight || waitTimeNight <= 0;

  // S'assurer que les pourcentages sont valides
  console.log('Calculated percentages:', { 
    dayPercentage, 
    nightPercentage, 
    isFullDayRate, 
    total: dayPercentage + nightPercentage
  });

  return (
    <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200 mt-2 mb-2">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">Temps d'attente</span>
      </div>
      <DayNightGauge
        dayPercentage={isFullDayRate ? 100 : dayPercentage}
        nightPercentage={isFullDayRate ? 0 : nightPercentage}
        dayKm={waitTimeDay}
        nightKm={waitTimeNight}
        isWaitingTime={true}
      />
      {(waitPriceDay > 0 || waitPriceNight > 0) && (
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <span>{waitTimeDay} min (jour)</span>
          <span>{isFullDayRate ? '0' : waitTimeNight} min (nuit)</span>
        </div>
      )}
    </div>
  );
};
