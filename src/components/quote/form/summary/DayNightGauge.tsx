
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DayNightGaugeProps {
  dayPercentage: number;
  nightPercentage: number;
  dayKm?: number;
  nightKm?: number;
}

export const DayNightGauge: React.FC<DayNightGaugeProps> = ({ 
  dayPercentage, 
  nightPercentage,
  dayKm,
  nightKm
}) => {
  // Assurons-nous que les pourcentages sont bien des nombres et arrondis
  const formattedDayPercentage = Math.round(dayPercentage || 0);
  const formattedNightPercentage = Math.round(nightPercentage || 0);

  // Forçons les pourcentages à totaliser 100%
  const totalPercentage = formattedDayPercentage + formattedNightPercentage;
  const adjustedDayPercentage = totalPercentage === 0 ? 100 : (formattedDayPercentage / totalPercentage) * 100;
  const adjustedNightPercentage = totalPercentage === 0 ? 0 : (formattedNightPercentage / totalPercentage) * 100;

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span className="text-xs">Tarif jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 rounded"></div>
            <span className="text-xs">Attente jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-xs">Attente nuit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span className="text-xs">Tarif nuit</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Sun className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-sm font-medium">
            Jour ({formattedDayPercentage}%)
            {dayKm !== undefined && <span className="text-xs ml-1">({dayKm.toFixed(1)} km)</span>}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            Nuit ({formattedNightPercentage}%)
            {nightKm !== undefined && <span className="text-xs ml-1">({nightKm.toFixed(1)} km)</span>}
          </span>
          <Moon className="h-4 w-4 text-blue-600 ml-1" />
        </div>
      </div>
      
      <div className="relative h-5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 bg-amber-400 transition-all duration-300 flex items-center justify-center text-xs font-medium text-amber-900"
          style={{ width: `${adjustedDayPercentage}%` }}
        >
          {formattedDayPercentage > 15 && `${formattedDayPercentage}%`}
        </div>
        <div
          className="absolute inset-y-0 right-0 bg-blue-500 transition-all duration-300 flex items-center justify-center text-xs font-medium text-white"
          style={{ width: `${adjustedNightPercentage}%` }}
        >
          {formattedNightPercentage > 15 && `${formattedNightPercentage}%`}
        </div>
      </div>
    </div>
  );
};
