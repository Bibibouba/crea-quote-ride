
import React from 'react';
import { PriceFormatter } from './PriceFormatter';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Clock } from 'lucide-react';

interface ExactPriceDetailsProps {
  dayKm: number;
  nightKm: number;
  dayPrice: number;
  nightPrice: number;
  basePrice: number;
  nightPercentage: number;
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  waitingTimePrice?: number;
  sundaySurcharge?: number;
  sundayPercentage?: number;
}

export const ExactPriceDetails: React.FC<ExactPriceDetailsProps> = ({
  dayKm,
  nightKm,
  dayPrice,
  nightPrice,
  basePrice,
  nightPercentage,
  totalHT,
  totalVAT,
  totalTTC,
  waitingTimePrice = 0,
  sundaySurcharge = 0,
  sundayPercentage = 0
}) => {
  return (
    <div className="space-y-3">
      {/* Tarif jour */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Tarif jour</p>
            <p className="text-xs text-muted-foreground">
              {dayKm.toFixed(1)} km × {basePrice.toFixed(2)}€/km
            </p>
          </div>
        </div>
        <PriceFormatter price={dayPrice} className="font-medium" />
      </div>

      {/* Tarif nuit - if there are night kilometers */}
      {nightKm > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Tarif nuit</p>
              <p className="text-xs text-muted-foreground">
                {nightKm.toFixed(1)} km × {basePrice.toFixed(2)}€/km {nightPercentage > 0 ? `+${nightPercentage}%` : ''}
              </p>
            </div>
          </div>
          <PriceFormatter price={nightPrice} className="font-medium" />
        </div>
      )}

      {/* Temps d'attente - if there is waiting time */}
      {waitingTimePrice > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <p className="text-sm font-medium">Temps d'attente</p>
          </div>
          <PriceFormatter price={waitingTimePrice} className="font-medium" />
        </div>
      )}

      {/* Majoration dimanche/férié - if there is a surcharge */}
      {sundaySurcharge > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 flex items-center justify-center text-red-500 font-bold flex-shrink-0">D</div>
            <div>
              <p className="text-sm font-medium">Majoration dimanche/férié</p>
              <p className="text-xs text-muted-foreground">
                +{sundayPercentage}%
              </p>
            </div>
          </div>
          <PriceFormatter price={sundaySurcharge} className="font-medium" />
        </div>
      )}

      <Separator className="my-1" />

      {/* Total HT */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Total HT</p>
        <PriceFormatter price={totalHT} className="font-medium" />
      </div>

      {/* TVA */}
      <div className="flex justify-between items-center">
        <p className="text-sm">TVA</p>
        <PriceFormatter price={totalVAT} />
      </div>

      {/* Total TTC */}
      <div className="flex justify-between items-center pt-2 border-t">
        <p className="font-bold">Total TTC</p>
        <PriceFormatter price={totalTTC} className="text-lg font-bold" />
      </div>
    </div>
  );
};
