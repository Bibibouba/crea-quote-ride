
import React from 'react';
import { QuoteDetailsType } from '@/types/quoteForm';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { TripSegmentDetails } from './price-details/TripSegmentDetails';
import { VATDetails } from './price-details/VATDetails';
import { TotalSection } from './price-details/TotalSection';
import { SurchargesSection } from './price-details/SurchargesSection';

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

  return (
    <div className="space-y-4">
      {/* Trajet Aller */}
      <div className="bg-slate-50 border rounded-md p-3">
        <h3 className="font-semibold text-base mb-2">Trajet Aller</h3>
        <TripSegmentDetails
          title="Trajet Aller"
          dayKm={quoteDetails.dayKm}
          nightKm={quoteDetails.nightKm}
          dayPrice={quoteDetails.dayPrice}
          nightPrice={quoteDetails.nightPrice}
          basePrice={quoteDetails.basePrice || 0}
          nightRatePercentage={quoteDetails.nightRatePercentage}
          nightStartDisplay={quoteDetails.nightStartDisplay}
          nightEndDisplay={quoteDetails.nightEndDisplay}
        />
        <div className="flex justify-between font-medium text-sm pt-1 border-t border-slate-200 mt-2">
          <span>Total Trajet</span>
          <span>{formatPrice(quoteDetails.oneWayPriceHT)}</span>
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
          <TripSegmentDetails
            title="Trajet Retour"
            dayKm={quoteDetails.returnDayKm}
            nightKm={quoteDetails.returnNightKm}
            dayPrice={quoteDetails.returnDayPrice}
            nightPrice={quoteDetails.returnNightPrice}
            basePrice={quoteDetails.basePrice || 0}
            nightRatePercentage={quoteDetails.nightRatePercentage}
            nightStartDisplay={quoteDetails.nightStartDisplay}
            nightEndDisplay={quoteDetails.nightEndDisplay}
          />
          <div className="flex justify-between font-medium text-sm pt-1 border-t border-slate-200 mt-2">
            <span>Total Trajet Retour</span>
            <span>{formatPrice(quoteDetails.returnPriceHT)}</span>
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
          
          <SurchargesSection
            quoteDetails={quoteDetails}
            nightSurcharge={quoteDetails.nightSurcharge}
            sundaySurcharge={quoteDetails.sundaySurcharge}
          />
          
          <div className="flex justify-between font-medium pt-1 border-t border-slate-200 mt-1">
            <span>Total</span>
            <span>{formatPrice(quoteDetails.totalPriceHT)}</span>
          </div>
        </div>
      </div>
      
      {/* Détail TVA */}
      <VATDetails quoteDetails={quoteDetails} hasWaitingTime={hasWaitingTime || false} />
      
      {/* Totaux */}
      <TotalSection
        totalPriceHT={quoteDetails.totalPriceHT || 0}
        totalPrice={quoteDetails.totalPrice || 0}
        hasMinDistanceWarning={quoteDetails.hasMinDistanceWarning}
      />
    </div>
  );
};
