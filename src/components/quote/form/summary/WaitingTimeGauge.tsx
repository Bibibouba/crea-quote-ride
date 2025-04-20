
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
  const dayPercentage = (waitTimeDay / totalWaitTime) * 100;
  const nightPercentage = (waitTimeNight / totalWaitTime) * 100;

  // S'assurer que les pourcentages sont valides
  console.log('Calculated percentages:', { dayPercentage, nightPercentage });

  return (
    <div className="py-3 px-2 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium">Temps d'attente</span>
      </div>
      <DayNightGauge
        dayPercentage={dayPercentage}
        nightPercentage={nightPercentage}
        dayKm={waitTimeDay}
        nightKm={waitTimeNight}
        isWaitingTime={true}
      />
    </div>
  );
};
