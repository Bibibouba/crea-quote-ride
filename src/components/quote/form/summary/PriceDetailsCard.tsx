
import React from 'react';
import { QuoteDetailsType } from '@/types/quoteForm';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { formatWaitingTime } from './WaitingTimeDisplay';

interface PriceDetailsCardProps {
  quoteDetails: QuoteDetailsType;
  hasWaitingTime?: boolean;
  waitingTimeMinutes?: number;
  hasReturnTrip?: boolean;
}

export const PriceDetailsCard: React.FC<PriceDetailsCardProps> = ({
  quoteDetails,
  hasWaitingTime,
  waitingTimeMinutes,
  hasReturnTrip
}) => {
  if (!quoteDetails) {
    return <p className="text-sm">Aucune donnée de tarification disponible</p>;
  }

  // Formater les heures de trajet
  const formatTimeRange = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
    
    return `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  // Calcul du prix TTC pour un segment
  const calculateTTC = (priceHT: number, vatRate: number = 10) => {
    return priceHT * (1 + vatRate / 100);
  };

  return (
    <div className="space-y-4">
      {/* Trajet Aller */}
      <div className="bg-slate-50 border rounded-md p-3">
        <h3 className="font-semibold text-base mb-2">Trajet Aller</h3>
        <div className="space-y-2">
          {quoteDetails.dayKm > 0 && (
            <div className="text-sm">
              <div className="flex justify-between font-medium">
                <span>Segment 1 (Tarif jour)</span>
                <span>{formatPrice(quoteDetails.dayPrice)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>{quoteDetails.nightStartDisplay && quoteDetails.nightEndDisplay ? 
                    `${quoteDetails.nightEndDisplay} - ${quoteDetails.nightStartDisplay}` : 
                    formatTimeRange(quoteDetails.time, quoteDetails.dayKm / 60)}</span>
                  <span>{Math.round(quoteDetails.dayKm * 10) / 10} km</span>
                </div>
                <div className="flex justify-between">
                  <span>{Math.round(quoteDetails.dayKm * 10) / 10} km × {quoteDetails.basePrice.toFixed(2)}€/km HT</span>
                  <span>
                    {formatPrice(quoteDetails.dayPrice)} HT / 
                    {formatPrice(calculateTTC(quoteDetails.dayPrice, quoteDetails.rideVatRate))} TTC
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {quoteDetails.nightKm > 0 && (
            <div className="text-sm mt-2">
              <div className="flex justify-between font-medium">
                <span>Segment 2 (Tarif nuit)</span>
                <span>{formatPrice(quoteDetails.nightPrice)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>{quoteDetails.nightStartDisplay && quoteDetails.nightEndDisplay ? 
                    `${quoteDetails.nightStartDisplay} - ${quoteDetails.nightEndDisplay}` : 
                    formatTimeRange(quoteDetails.time, quoteDetails.nightKm / 60)}</span>
                  <span>{Math.round(quoteDetails.nightKm * 10) / 10} km</span>
                </div>
                <div className="flex justify-between">
                  <span>{Math.round(quoteDetails.nightKm * 10) / 10} km × {quoteDetails.basePrice.toFixed(2)}€/km HT (+{quoteDetails.nightRatePercentage}%)</span>
                  <span>
                    {formatPrice(quoteDetails.nightPrice)} HT / 
                    {formatPrice(calculateTTC(quoteDetails.nightPrice, quoteDetails.rideVatRate))} TTC
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between font-medium text-sm pt-1 border-t border-slate-200 mt-2">
            <span>Total Trajet</span>
            <span>{formatPrice(quoteDetails.oneWayPriceHT)}</span>
          </div>
        </div>
      </div>
      
      {/* Temps d'Attente */}
      {hasWaitingTime && waitingTimeMinutes && quoteDetails.waitingTimePriceHT > 0 && (
        <div className="bg-slate-50 border rounded-md p-3">
          <h3 className="font-semibold text-base mb-2">Temps d'Attente</h3>
          <div className="space-y-2">
            {quoteDetails.waitPriceDay > 0 && (
              <div className="text-sm">
                <div className="flex justify-between font-medium">
                  <span>Attente (Tarif jour)</span>
                  <span>{formatPrice(quoteDetails.waitPriceDay)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{formatTimeRange(quoteDetails.time, quoteDetails.waitTimeDay)}</span>
                    <span>{quoteDetails.waitTimeDay} minutes</span>
                  </div>
                </div>
              </div>
            )}
            
            {quoteDetails.waitPriceNight > 0 && (
              <div className="text-sm mt-2">
                <div className="flex justify-between font-medium">
                  <span>Attente (Tarif nuit)</span>
                  <span>{formatPrice(quoteDetails.waitPriceNight)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{formatTimeRange(quoteDetails.time, quoteDetails.waitTimeNight)}</span>
                    <span>{quoteDetails.waitTimeNight} minutes</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between font-medium text-sm pt-1 border-t border-slate-200 mt-2">
              <span>Total Attente</span>
              <span>{formatPrice(quoteDetails.waitingTimePriceHT)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Trajet Retour */}
      {hasReturnTrip && (
        <div className="bg-slate-50 border rounded-md p-3">
          <h3 className="font-semibold text-base mb-2">Trajet Retour</h3>
          <div className="space-y-2">
            {quoteDetails.returnDayKm > 0 && (
              <div className="text-sm">
                <div className="flex justify-between font-medium">
                  <span>Segment 1 (Tarif jour)</span>
                  <span>{formatPrice(quoteDetails.returnDayPrice)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{quoteDetails.nightStartDisplay && quoteDetails.nightEndDisplay ? 
                      `${quoteDetails.nightEndDisplay} - ${quoteDetails.nightStartDisplay}` : 
                      "Période jour"}</span>
                    <span>{Math.round(quoteDetails.returnDayKm * 10) / 10} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{Math.round(quoteDetails.returnDayKm * 10) / 10} km × {quoteDetails.basePrice.toFixed(2)}€/km HT</span>
                    <span>
                      {formatPrice(quoteDetails.returnDayPrice)} HT / 
                      {formatPrice(calculateTTC(quoteDetails.returnDayPrice, quoteDetails.rideVatRate))} TTC
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {quoteDetails.returnNightKm > 0 && (
              <div className="text-sm mt-2">
                <div className="flex justify-between font-medium">
                  <span>Segment 2 (Tarif nuit)</span>
                  <span>{formatPrice(quoteDetails.returnNightPrice)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{quoteDetails.nightStartDisplay && quoteDetails.nightEndDisplay ? 
                      `${quoteDetails.nightStartDisplay} - ${quoteDetails.nightEndDisplay}` : 
                      "Période nuit"}</span>
                    <span>{Math.round(quoteDetails.returnNightKm * 10) / 10} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{Math.round(quoteDetails.returnNightKm * 10) / 10} km × {quoteDetails.basePrice.toFixed(2)}€/km HT (+{quoteDetails.nightRatePercentage}%)</span>
                    <span>
                      {formatPrice(quoteDetails.returnNightPrice)} HT / 
                      {formatPrice(calculateTTC(quoteDetails.returnNightPrice, quoteDetails.rideVatRate))} TTC
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between font-medium text-sm pt-1 border-t border-slate-200 mt-2">
              <span>Total Trajet Retour</span>
              <span>{formatPrice(quoteDetails.returnPriceHT)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Récapitulatif par segment */}
      <div className="bg-slate-50 border rounded-md p-3">
        <h3 className="font-semibold text-base mb-2">Récapitulatif par segment</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Trajet Aller</span>
            <span>{formatPrice(quoteDetails.oneWayPriceHT)}</span>
          </div>
          
          {hasWaitingTime && (
            <div className="flex justify-between">
              <span>Temps d'Attente</span>
              <span>{formatPrice(quoteDetails.waitingTimePriceHT)}</span>
            </div>
          )}
          
          {hasReturnTrip && (
            <div className="flex justify-between">
              <span>Trajet Retour</span>
              <span>{formatPrice(quoteDetails.returnPriceHT)}</span>
            </div>
          )}
          
          {(quoteDetails.sundaySurcharge > 0 || quoteDetails.nightSurcharge > 0) && (
            <div className="flex justify-between">
              <span>Majorations supplémentaires</span>
              <span>{formatPrice((quoteDetails.sundaySurcharge || 0) + (quoteDetails.nightSurcharge || 0))}</span>
            </div>
          )}
          
          <div className="flex justify-between font-medium pt-1 border-t border-slate-200 mt-1">
            <span>Total</span>
            <span>{formatPrice(quoteDetails.totalPriceHT)}</span>
          </div>
        </div>
      </div>
      
      {/* Détail TVA */}
      <div className="bg-slate-50 border rounded-md p-3">
        <h3 className="font-semibold text-base mb-2">Détail TVA</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Trajets ({quoteDetails.rideVatRate}%)</span>
            <span>{formatPrice((quoteDetails.oneWayPrice + quoteDetails.returnPrice) - (quoteDetails.oneWayPriceHT + quoteDetails.returnPriceHT))}</span>
          </div>
          
          {hasWaitingTime && (
            <div className="flex justify-between">
              <span>Temps d'attente ({quoteDetails.waitingVatRate}%)</span>
              <span>{formatPrice(quoteDetails.waitingTimePrice - quoteDetails.waitingTimePriceHT)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-medium pt-1 border-t border-slate-200 mt-1">
            <span>Total TVA</span>
            <span>{formatPrice(quoteDetails.totalVAT)}</span>
          </div>
        </div>
      </div>
      
      {/* Totaux */}
      <div className="bg-slate-100 border rounded-md p-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-medium">
            <span>Total HT</span>
            <span>{formatPrice(quoteDetails.totalPriceHT)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-1 border-t border-slate-200">
            <span>Total TTC</span>
            <span>{formatPrice(quoteDetails.totalPrice)}</span>
          </div>
        </div>
      </div>
      
      {quoteDetails.hasMinDistanceWarning && (
        <div className="text-xs text-amber-600">
          <p>* Un supplément pour distance minimale a été appliqué.</p>
        </div>
      )}
    </div>
  );
};
