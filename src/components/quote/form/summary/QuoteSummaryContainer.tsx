
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm';
import { RouteInfoCard } from './RouteInfoCard';
import { MapSection } from './MapSection';
import { TripDetailsSection } from './TripDetailsSection';
import { QuoteActions } from './QuoteActions';
import { QuoteFooter } from './QuoteFooter';
import { calculateNightHours } from '@/utils/pricing/calculateNightHours';

interface QuoteSummaryProps {
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
  date: Date;
  time: string;
  estimatedDistance: number;
  estimatedDuration: number;
  selectedVehicle: string;
  passengers: string;
  basePrice: number;
  estimatedPrice: number;
  isSubmitting: boolean;
  onSaveQuote: () => void;
  onEditQuote: () => void;
  showClientInfo: boolean;
  clientInfoComponent?: React.ReactNode;
  vehicles: Vehicle[];
  hasReturnTrip?: boolean;
  hasWaitingTime?: boolean;
  waitingTimeMinutes?: number;
  waitingTimePrice?: number;
  returnToSameAddress?: boolean;
  customReturnAddress?: string;
  returnDistance?: number;
  returnDuration?: number;
  returnCoordinates?: [number, number] | undefined;
  quoteDetails?: QuoteDetailsType;
}

const QuoteSummaryContainer: React.FC<QuoteSummaryProps> = ({
  departureAddress,
  destinationAddress,
  departureCoordinates,
  destinationCoordinates,
  date,
  time,
  estimatedDistance,
  estimatedDuration,
  selectedVehicle,
  passengers,
  basePrice,
  estimatedPrice,
  isSubmitting,
  onSaveQuote,
  onEditQuote,
  showClientInfo,
  clientInfoComponent,
  vehicles,
  hasReturnTrip = false,
  hasWaitingTime = false,
  waitingTimeMinutes = 0,
  waitingTimePrice = 0,
  returnToSameAddress = true,
  customReturnAddress = '',
  returnDistance = 0,
  returnDuration = 0,
  returnCoordinates,
  quoteDetails
}) => {
  const isMobile = useIsMobile();
  
  const returnPrice = hasReturnTrip ? (returnToSameAddress ? estimatedPrice : Math.round(returnDistance * basePrice)) : 0;
  
  const totalPrice = estimatedPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
  
  const selectedVehicleObj = vehicles.find(v => v.id === selectedVehicle);
  const hasNightRate = selectedVehicleObj?.night_rate_enabled || false;
  const nightRatePercentage = selectedVehicleObj?.night_rate_percentage || 0;
  const nightRateStart = selectedVehicleObj?.night_rate_start || '20:00';
  const nightRateEnd = selectedVehicleObj?.night_rate_end || '06:00';
  
  const [hours, minutes] = time.split(':').map(Number);
  const rideTime = new Date(date);
  rideTime.setHours(hours, minutes);
  
  const nightStartTime = new Date(date);
  const [nightStartHours, nightStartMinutes] = nightRateStart?.split(':').map(Number) || [0, 0];
  nightStartTime.setHours(nightStartHours, nightStartMinutes);
  
  const nightEndTime = new Date(date);
  const [nightEndHours, nightEndMinutes] = nightRateEnd?.split(':').map(Number) || [0, 0];
  nightEndTime.setHours(nightEndHours, nightEndMinutes);
  
  const tripEndTime = new Date(rideTime);
  tripEndTime.setMinutes(tripEndTime.getMinutes() + estimatedDuration);
  
  // Calculate night hours using the extracted utility
  const { isNightRateApplied, nightHours, dayHours } = hasNightRate
    ? calculateNightHours(
        hours,
        minutes,
        estimatedDuration,
        nightStartHours,
        nightStartMinutes,
        nightEndHours,
        nightEndMinutes
      )
    : { isNightRateApplied: false, nightHours: 0, dayHours: 0 };
  
  const isSunday = date.getDay() === 0;
  const sundayRate = selectedVehicleObj?.holiday_sunday_percentage || 0;
  
  return (
    <div className="space-y-6">
      <RouteInfoCard 
        departureAddress={departureAddress}
        destinationAddress={destinationAddress}
        estimatedDistance={estimatedDistance}
        estimatedDuration={estimatedDuration}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MapSection 
          departureCoordinates={departureCoordinates}
          destinationCoordinates={destinationCoordinates}
          returnCoordinates={returnCoordinates}
          hasReturnTrip={hasReturnTrip}
          returnToSameAddress={returnToSameAddress}
        />
        
        <TripDetailsSection
          selectedVehicle={selectedVehicle}
          passengers={passengers}
          basePrice={basePrice}
          estimatedPrice={estimatedPrice}
          vehicles={vehicles}
          time={time}
          hasWaitingTime={hasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          waitingTimePrice={waitingTimePrice}
          hasReturnTrip={hasReturnTrip}
          returnToSameAddress={returnToSameAddress}
          customReturnAddress={customReturnAddress}
          returnDistance={returnDistance}
          returnDuration={returnDuration}
          returnPrice={returnPrice}
          totalPrice={totalPrice}
          tripEndTime={tripEndTime}
          isNightRateApplied={isNightRateApplied}
          nightHours={nightHours}
          dayHours={dayHours}
          isSunday={isSunday}
          nightRatePercentage={nightRatePercentage}
          nightRateStart={nightRateStart}
          nightRateEnd={nightRateEnd}
          sundayRate={sundayRate}
          quoteDetails={quoteDetails}
        />
      </div>
      
      {showClientInfo && clientInfoComponent}
      
      <QuoteActions
        isSubmitting={isSubmitting}
        onSaveQuote={onSaveQuote}
        onEditQuote={onEditQuote}
      />
      
      <QuoteFooter />
    </div>
  );
};

export default QuoteSummaryContainer;
