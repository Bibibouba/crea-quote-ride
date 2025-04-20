
import React from 'react';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm';
import { PriceFormatter } from './PriceFormatter';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import { ReturnTripDisplay } from './ReturnTripDisplay';
import { TripTimeInfo } from './TripTimeInfo';
import { WaitingTimeDetailDisplay } from './WaitingTimeDetailDisplay';
import { ExactPriceDetails } from './ExactPriceDetails';
import { WaitingTimeGauge } from './WaitingTimeGauge';

interface TripDetailsCardProps {
  selectedVehicle: string;
  passengers: string;
  basePrice: number;
  estimatedPrice: number;
  vehicles: Vehicle[];
  time: string;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  returnDistance: number;
  returnDuration: number;
  returnPrice: number;
  totalPrice: number;
  tripEndTime: Date;
  isNightRateApplied: boolean;
  nightHours: number;
  dayHours: number;
  isSunday: boolean;
  nightRatePercentage: number;
  nightRateStart: string;
  nightRateEnd: string;
  sundayRate: number;
  quoteDetails?: QuoteDetailsType;
}

export const TripDetailsCard: React.FC<TripDetailsCardProps> = ({
  selectedVehicle,
  passengers,
  basePrice,
  estimatedPrice,
  vehicles,
  time,
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  hasReturnTrip,
  returnToSameAddress,
  customReturnAddress,
  returnDistance,
  returnDuration,
  returnPrice,
  totalPrice,
  tripEndTime,
  isNightRateApplied,
  nightHours,
  dayHours,
  isSunday,
  nightRatePercentage,
  nightRateStart,
  nightRateEnd,
  sundayRate,
  quoteDetails
}) => {
  // Check if we have complete details to display the exact price breakdown
  const hasCompleteDetails = !!quoteDetails?.dayKm && !!quoteDetails?.nightKm;
  
  // Conditions pour afficher la jauge de temps d'attente
  const shouldShowWaitingTimeGauge = hasWaitingTime && 
                                    waitingTimeMinutes > 0 && 
                                    quoteDetails?.waitTimeDay !== undefined &&
                                    quoteDetails?.waitTimeNight !== undefined;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium">Véhicule sélectionné</p>
          <p>{vehicles.find(v => v.id === selectedVehicle)?.name || "Berline"}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Nombre de passagers</p>
          <p>{passengers} {parseInt(passengers) === 1 ? 'passager' : 'passagers'}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Prix au kilomètre</p>
          <p>{basePrice.toFixed(2)}€/km</p>
        </div>
        
        {hasCompleteDetails ? (
          <ExactPriceDetails 
            dayKm={quoteDetails.dayKm}
            nightKm={quoteDetails.nightKm}
            dayPrice={quoteDetails.dayPrice}
            nightPrice={quoteDetails.nightPrice}
            basePrice={basePrice}
            nightPercentage={nightRatePercentage}
            totalHT={quoteDetails.totalPriceHT}
            totalVAT={quoteDetails.totalVAT}
            totalTTC={quoteDetails.totalPrice}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="font-medium">Trajet aller</p>
              </div>
              <PriceFormatter price={estimatedPrice} />
            </div>
            
            <TripTimeInfo 
              startTime={time} 
              endTime={tripEndTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              finalTimeDisplay={tripEndTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              nightRateInfo={{
                isApplied: isNightRateApplied,
                percentage: nightRatePercentage,
                nightHours,
                totalHours: nightHours + dayHours,
                nightStart: nightRateStart,
                nightEnd: nightRateEnd,
                nightSurcharge: quoteDetails?.nightSurcharge,
                dayKm: quoteDetails?.dayKm,
                nightKm: quoteDetails?.nightKm,
                totalKm: quoteDetails?.totalKm,
                dayPrice: quoteDetails?.dayPrice,
                nightPrice: quoteDetails?.nightPrice
              }}
              sundayRateInfo={isSunday ? { isApplied: true, percentage: sundayRate } : undefined}
            />
            
            {/* Modifier la condition d'affichage pour la jauge de temps d'attente */}
            {shouldShowWaitingTimeGauge && (
              <WaitingTimeGauge
                waitTimeDay={quoteDetails.waitTimeDay || 0}
                waitTimeNight={quoteDetails.waitTimeNight || 0}
                waitPriceDay={quoteDetails.waitPriceDay || 0}
                waitPriceNight={quoteDetails.waitPriceNight || 0}
                totalWaitTime={waitingTimeMinutes}
              />
            )}
            
            <WaitingTimeDetailDisplay 
              hasWaitingTime={hasWaitingTime}
              waitingTimeMinutes={waitingTimeMinutes}
              waitingTimePrice={waitingTimePrice}
              quoteDetails={quoteDetails}
            />
            
            <ReturnTripDisplay 
              hasReturnTrip={hasReturnTrip}
              returnToSameAddress={returnToSameAddress}
              customReturnAddress={customReturnAddress}
              returnPrice={returnPrice}
              returnDistance={returnDistance}
              returnDuration={returnDuration}
            />
            
            <Separator className="my-2" />
            
            <div className="flex justify-between border-t border-border/60 pt-4">
              <p className="font-medium">Montant total</p>
              <p className="text-xl font-bold">
                <PriceFormatter price={totalPrice} />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
