
import { Separator } from '@/components/ui/separator';
import { Vehicle } from '@/types/quoteForm';
import { ArrowRight } from 'lucide-react';
import { PriceFormatter } from './PriceFormatter';
import { WaitingTimeDisplay } from './WaitingTimeDisplay';
import { ReturnTripDisplay } from './ReturnTripDisplay';
import { QuoteDetailsType } from '../QuoteSummary';
import { TripTimeInfo, NightRateInfo, SundayRateInfo } from './TripTimeInfo';

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
    nightEnd: nightRateEnd
  } : undefined;

  const sundayRateInfo: SundayRateInfo | undefined = isSunday && sundayRate > 0 ? {
    isApplied: true,
    percentage: sundayRate,
  } : undefined;

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
        
        {/* Trajet aller */}
        <div className="flex justify-between">
          <div className="flex items-center">
            <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="font-medium">Trajet aller</p>
          </div>
          <PriceFormatter price={estimatedPrice} />
        </div>
        
        {/* Afficher les infos de tarif de nuit et dimanche si applicable */}
        <TripTimeInfo 
          startTime={time} 
          endTime={formatTimeDisplay(tripEndTime)}
          nightRateInfo={nightRateInfo}
          sundayRateInfo={sundayRateInfo}
        />
        
        {/* Display waiting time information */}
        <WaitingTimeDisplay 
          hasWaitingTime={hasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          waitingTimePrice={waitingTimePrice}
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
      </div>
    </div>
  );
};
