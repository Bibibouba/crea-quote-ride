
import { Separator } from '@/components/ui/separator';
import { Vehicle } from '@/types/quoteForm';
import { ArrowRight } from 'lucide-react';
import { PriceFormatter } from './PriceFormatter';
import { ReturnTripDisplay } from './ReturnTripDisplay';
import { QuoteDetailsType } from '@/types/quoteForm';
import { TripTimeInfo, NightRateInfo, SundayRateInfo } from './TripTimeInfo';
import { WaitingTimeDetailDisplay } from './WaitingTimeDetailDisplay';
import { ExactPriceDetails } from './ExactPriceDetails';
import { DayNightSplit } from './DayNightSplit';

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
  const formatTimeDisplay = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Prepare data for TripTimeInfo component
  const nightRateInfo: NightRateInfo | undefined = isNightRateApplied ? {
    isApplied: true,
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
  } : undefined;

  const sundayRateInfo: SundayRateInfo | undefined = isSunday && sundayRate > 0 ? {
    isApplied: true,
    percentage: sundayRate,
  } : undefined;

  // Vérifier si nous avons les détails complets pour utiliser le composant ExactPriceDetails
  const hasCompleteDetails = quoteDetails && 
    quoteDetails.dayKm !== undefined && 
    quoteDetails.nightKm !== undefined &&
    quoteDetails.dayPrice !== undefined &&
    quoteDetails.nightPrice !== undefined &&
    quoteDetails.totalPriceHT !== undefined &&
    quoteDetails.totalVAT !== undefined &&
    quoteDetails.totalPrice !== undefined;

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
        
        {/* Afficher soit ExactPriceDetails, soit le détail standard basé sur le trip */}
        {hasCompleteDetails ? (
          <>
            {/* New component for day/night split visualization */}
            <DayNightSplit 
              dayKm={quoteDetails.dayKm}
              nightKm={quoteDetails.nightKm}
              totalKm={quoteDetails.totalKm}
              nightRatePercentage={nightRatePercentage}
              nightStartTime={nightRateStart}
              nightEndTime={nightRateEnd}
            />
            
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
          </>
        ) : (
          <>
            {/* Trajet aller */}
            <div className="flex justify-between">
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="font-medium">Trajet aller</p>
              </div>
              <PriceFormatter price={estimatedPrice} />
            </div>
            
            {/* Afficher les infos de tarif de nuit et dimanche avant waiting time et return trip */}
            <TripTimeInfo 
              startTime={time} 
              endTime={formatTimeDisplay(tripEndTime)}
              nightRateInfo={nightRateInfo}
              sundayRateInfo={sundayRateInfo}
            />
            
            {/* Display detailed waiting time information */}
            <WaitingTimeDetailDisplay 
              hasWaitingTime={hasWaitingTime}
              waitingTimeMinutes={waitingTimeMinutes}
              waitingTimePrice={waitingTimePrice}
              quoteDetails={quoteDetails}
            />
            
            {/* Display return trip information */}
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
          </>
        )}
      </div>
    </div>
  );
};
