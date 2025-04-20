
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DayNightGaugeProps {
  dayPercentage: number;
  nightPercentage: number;
  dayKm?: number;
  nightKm?: number;
  isWaitingTime?: boolean;
}

export const DayNightGauge: React.FC<DayNightGaugeProps> = ({ 
  dayPercentage, 
  nightPercentage,
  dayKm,
  nightKm,
  isWaitingTime = false
}) => {
  // Assurons-nous que les pourcentages sont bien des nombres et arrondis
  const formattedDayPercentage = Math.round(dayPercentage || 0);
  const formattedNightPercentage = Math.round(nightPercentage || 0);

  // Forçons les pourcentages à totaliser 100%
  let adjustedDayPercentage = formattedDayPercentage;
  let adjustedNightPercentage = formattedNightPercentage;
  
  const totalPercentage = adjustedDayPercentage + adjustedNightPercentage;
  if (totalPercentage !== 100) {
    if (formattedNightPercentage === 0) {
      adjustedDayPercentage = 100;
    } else if (formattedDayPercentage === 0) {
      adjustedNightPercentage = 100;
    } else {
      // Normalisation proportionnelle
      adjustedDayPercentage = Math.round((formattedDayPercentage / totalPercentage) * 100);
      adjustedNightPercentage = 100 - adjustedDayPercentage;
    }
  }
  
  // Debug pour vérifier les valeurs
  console.log('DayNightGauge values:', {
    originalDayPercentage: dayPercentage,
    originalNightPercentage: nightPercentage,
    formattedDayPercentage,
    formattedNightPercentage,
    adjustedDayPercentage,
    adjustedNightPercentage,
    dayKm,
    nightKm,
    isWaitingTime
  });

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <Sun className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-sm font-medium">
            {isWaitingTime ? (
              <>Jour ({adjustedDayPercentage}%)
                {dayKm !== undefined && <span className="text-xs ml-1">({dayKm} min)</span>}
              </>
            ) : (
              <>Jour ({adjustedDayPercentage}%)
                {dayKm !== undefined && <span className="text-xs ml-1">({dayKm.toFixed(1)} km)</span>}
              </>
            )}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {isWaitingTime ? (
              <>Nuit ({adjustedNightPercentage}%)
                {nightKm !== undefined && <span className="text-xs ml-1">({nightKm} min)</span>}
              </>
            ) : (
              <>Nuit ({adjustedNightPercentage}%)
                {nightKm !== undefined && <span className="text-xs ml-1">({nightKm.toFixed(1)} km)</span>}
              </>
            )}
          </span>
          <Moon className="h-4 w-4 text-blue-600 ml-1" />
        </div>
      </div>
      
      <div className="relative h-5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-300 flex items-center justify-center text-xs font-medium ${
            isWaitingTime ? 'bg-orange-400 text-orange-900' : 'bg-amber-400 text-amber-900'
          }`}
          style={{ width: `${adjustedDayPercentage}%` }}
        >
          {adjustedDayPercentage > 15 && `${adjustedDayPercentage}%`}
        </div>
        <div
          className={`absolute inset-y-0 right-0 transition-all duration-300 flex items-center justify-center text-xs font-medium ${
            isWaitingTime ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
          }`}
          style={{ width: `${adjustedNightPercentage}%` }}
        >
          {adjustedNightPercentage > 15 && `${adjustedNightPercentage}%`}
        </div>
      </div>
    </div>
  );
};
