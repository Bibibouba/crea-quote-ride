
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
  // Debugging log pour s'assurer que les bonnes valeurs sont reçues
  console.log('WaitingTimeGauge rendered with raw values:', {
    waitTimeDay,
    waitTimeNight,
    totalWaitTime,
    waitStartTime: waitStartTime?.toISOString(),
    waitEndTime: waitEndTime?.toISOString(),
    startTimeDisplay,
    endTimeDisplay
  });

  // Pas de rendu si pas de temps d'attente
  if (!totalWaitTime || totalWaitTime <= 0) return null;

  // Correction critique: S'assurer que waitTimeDay + waitTimeNight = totalWaitTime
  // Si les temps calculés ne correspondent pas au temps total, recalculer les proportions
  let adjustedDayTime = waitTimeDay;
  let adjustedNightTime = waitTimeNight;
  
  const calculatedTotal = waitTimeDay + waitTimeNight;
  
  if (Math.abs(calculatedTotal - totalWaitTime) > 1) { // Tolérance de 1 minute pour les erreurs d'arrondi
    console.log('Correcting wait time discrepancy:', {
      originalTotal: calculatedTotal,
      expectedTotal: totalWaitTime,
      difference: totalWaitTime - calculatedTotal
    });
    
    // Si le total calculé diffère du total attendu, ajuster proportionnellement
    if (calculatedTotal > 0) {
      const ratio = totalWaitTime / calculatedTotal;
      adjustedDayTime = Math.round(waitTimeDay * ratio);
      adjustedNightTime = Math.round(waitTimeNight * ratio);
      
      // S'assurer que la somme est exactement égale à totalWaitTime
      const newTotal = adjustedDayTime + adjustedNightTime;
      if (newTotal !== totalWaitTime) {
        const diff = totalWaitTime - newTotal;
        // Ajouter la différence au jour ou à la nuit, selon lequel est non nul
        if (adjustedDayTime > 0) {
          adjustedDayTime += diff;
        } else {
          adjustedNightTime += diff;
        }
      }
    } else {
      // Si pas de répartition jour/nuit, tout attribuer au jour par défaut
      adjustedDayTime = totalWaitTime;
      adjustedNightTime = 0;
    }
  }

  // Calcul des pourcentages pour la jauge
  const dayPercentage = Math.max(0, Math.min(100, (adjustedDayTime / totalWaitTime) * 100));
  const nightPercentage = Math.max(0, Math.min(100, (adjustedNightTime / totalWaitTime) * 100));

  // Vérifier si on a un cas de 100% jour / 0% nuit
  const isFullDayRate = nightPercentage < 1 || !adjustedNightTime || adjustedNightTime <= 0;

  // S'assurer que les pourcentages sont valides et totalisent bien 100%
  const finalDayPercent = isFullDayRate ? 100 : Math.round(dayPercentage);
  const finalNightPercent = isFullDayRate ? 0 : Math.round(nightPercentage);

  console.log('Calculated percentages for waiting time gauge:', { 
    adjustedDayTime,
    adjustedNightTime,
    totalWaitTime,
    dayPercentage, 
    nightPercentage, 
    isFullDayRate, 
    finalDayPercent,
    finalNightPercent,
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
        dayPercentage={finalDayPercent}
        nightPercentage={finalNightPercent}
        dayKm={adjustedDayTime}
        nightKm={adjustedNightTime}
        isWaitingTime={true}
      />
      {(waitPriceDay > 0 || waitPriceNight > 0) && (
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <span>{Math.round(adjustedDayTime)} min (jour)</span>
          <span>{isFullDayRate ? '0' : Math.round(adjustedNightTime)} min (nuit)</span>
        </div>
      )}
    </div>
  );
};
