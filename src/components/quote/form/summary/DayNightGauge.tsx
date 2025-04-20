
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DayNightGaugeProps {
  dayPercentage: number;
  nightPercentage: number;
  dayKm?: number;
  nightKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  showValues?: boolean;
  isWaitingTime?: boolean;
}

export const DayNightGauge: React.FC<DayNightGaugeProps> = ({ 
  dayPercentage, 
  nightPercentage,
  dayKm,
  nightKm,
  dayPrice,
  nightPrice,
  showValues = false,
  isWaitingTime = false
}) => {
  // Assurons-nous que les pourcentages sont bien des nombres et arrondis
  const formattedDayPercentage = Math.round(dayPercentage || 0);
  const formattedNightPercentage = Math.round(nightPercentage || 0);

  // Forçons les pourcentages à totaliser 100%
  let adjustedDayPercentage = formattedDayPercentage;
  let adjustedNightPercentage = formattedNightPercentage;
  
  const totalPercentage = adjustedDayPercentage + adjustedNightPercentage;
  
  // Ajustement des pourcentages pour s'assurer qu'ils totalisent 100%
  if (totalPercentage !== 100) {
    if (formattedNightPercentage < 1) {
      adjustedDayPercentage = 100;
      adjustedNightPercentage = 0;
    } else if (formattedDayPercentage < 1) {
      adjustedDayPercentage = 0;
      adjustedNightPercentage = 100;
    } else {
      // Normalisation proportionnelle
      adjustedDayPercentage = Math.round((formattedDayPercentage / totalPercentage) * 100);
      adjustedNightPercentage = 100 - adjustedDayPercentage;
    }
  }
  
  // Pour le temps d'attente, s'assurer que les valeurs affichées sont cohérentes
  let displayDayKm = dayKm;
  let displayNightKm = nightKm;
  
  if (isWaitingTime && dayKm !== undefined && nightKm !== undefined) {
    const totalMinutes = (dayKm + nightKm);
    
    // Si les minutes ne correspondent pas aux pourcentages, ajuster les valeurs affichées
    if (totalMinutes > 0 && Math.abs(adjustedDayPercentage - (dayKm / totalMinutes * 100)) > 5) {
      console.log('Adjusting displayed wait time minutes to match percentages:', {
        original: { dayKm, nightKm, totalMinutes },
        dayPercentage: adjustedDayPercentage,
        nightPercentage: adjustedNightPercentage
      });
      
      // Recalculer en fonction des pourcentages
      displayDayKm = Math.round((adjustedDayPercentage / 100) * totalMinutes);
      displayNightKm = Math.round((adjustedNightPercentage / 100) * totalMinutes);
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
    originalDayKm: dayKm,
    originalNightKm: nightKm,
    displayDayKm,
    displayNightKm,
    isWaitingTime,
    totalPercentage,
    dayPrice,
    nightPrice,
    showValues
  });

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <Sun className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-sm font-medium">
            {isWaitingTime ? (
              <>Jour ({adjustedDayPercentage}%)
                {displayDayKm !== undefined && <span className="text-xs ml-1">({Math.round(displayDayKm)} min)</span>}
                {showValues && dayPrice !== undefined && <span className="text-xs ml-1">({dayPrice.toFixed(2)}€)</span>}
              </>
            ) : (
              <>Jour ({adjustedDayPercentage}%)
                {displayDayKm !== undefined && <span className="text-xs ml-1">({displayDayKm.toFixed(1)} km)</span>}
                {showValues && dayPrice !== undefined && <span className="text-xs ml-1">({dayPrice.toFixed(2)}€)</span>}
              </>
            )}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {isWaitingTime ? (
              <>Nuit ({adjustedNightPercentage}%)
                {displayNightKm !== undefined && <span className="text-xs ml-1">({Math.round(displayNightKm)} min)</span>}
                {showValues && nightPrice !== undefined && <span className="text-xs ml-1">({nightPrice.toFixed(2)}€)</span>}
              </>
            ) : (
              <>Nuit ({adjustedNightPercentage}%)
                {displayNightKm !== undefined && <span className="text-xs ml-1">({displayNightKm.toFixed(1)} km)</span>}
                {showValues && nightPrice !== undefined && <span className="text-xs ml-1">({nightPrice.toFixed(2)}€)</span>}
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
