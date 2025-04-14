
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { Vehicle } from '@/types/quoteForm';
import RouteMap from '@/components/map/RouteMap';
import { RouteInfoCard } from './summary/RouteInfoCard';
import { TripDetailsCard } from './summary/TripDetailsCard';
import { QuoteActions } from './summary/QuoteActions';
import { QuoteFooter } from './summary/QuoteFooter';

// Define QuoteDetailsType if not already defined
export interface QuoteDetailsType {
  oneWayPrice?: number;
  totalPrice?: number;
  nightRateHours?: number;
  dayRateHours?: number;
  isNightRateApplied?: boolean;
  sundayRateApplied?: boolean;
}

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

const QuoteSummary: React.FC<QuoteSummaryProps> = ({
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
  
  // Calculate the return price if applicable
  const returnPrice = hasReturnTrip ? (returnToSameAddress ? estimatedPrice : Math.round(returnDistance * basePrice)) : 0;
  
  // Calculate the total price including waiting time and return trip
  const totalPrice = estimatedPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
  
  // Format price with one decimal
  const formatPrice = (price: number) => {
    return price.toFixed(1);
  };
  
  // Get night rate details from the selected vehicle
  const selectedVehicleObj = vehicles.find(v => v.id === selectedVehicle);
  const hasNightRate = selectedVehicleObj?.night_rate_enabled || false;
  const nightRatePercentage = selectedVehicleObj?.night_rate_percentage || 0;
  const nightRateStart = selectedVehicleObj?.night_rate_start || '20:00';
  const nightRateEnd = selectedVehicleObj?.night_rate_end || '06:00';
  
  // Determine if the trip has a night portion based on time and duration
  const [hours, minutes] = time.split(':').map(Number);
  const rideTime = new Date(date);
  rideTime.setHours(hours, minutes);
  
  const nightStartTime = new Date(date);
  const [nightStartHours, nightStartMinutes] = nightRateStart?.split(':').map(Number) || [0, 0];
  nightStartTime.setHours(nightStartHours, nightStartMinutes);
  
  const nightEndTime = new Date(date);
  const [nightEndHours, nightEndMinutes] = nightRateEnd?.split(':').map(Number) || [0, 0];
  nightEndTime.setHours(nightEndHours, nightEndMinutes);
  
  // Calculate end time of the trip
  const tripEndTime = new Date(rideTime);
  tripEndTime.setMinutes(tripEndTime.getMinutes() + estimatedDuration);
  
  // Check if trip spans into night hours
  let isNightRateApplied = false;
  let nightHours = 0;
  let dayHours = 0;
  
  if (hasNightRate) {
    // Calculate if any part of the trip occurs during night rate hours
    const tripStartMinutes = hours * 60 + minutes;
    const tripDurationMinutes = estimatedDuration;
    const tripEndMinutes = (tripStartMinutes + tripDurationMinutes) % (24 * 60);
    
    const nightStartTotalMinutes = nightStartHours * 60 + nightStartMinutes;
    const nightEndTotalMinutes = nightEndHours * 60 + nightEndMinutes;
    
    // Night spans across midnight
    if (nightStartTotalMinutes > nightEndTotalMinutes) {
      // Trip starts before midnight
      if (tripStartMinutes >= nightStartTotalMinutes) {
        if (tripEndMinutes <= nightEndTotalMinutes) {
          // Trip entirely at night
          nightHours = tripDurationMinutes / 60;
          isNightRateApplied = true;
        } else if (tripEndMinutes > nightEndTotalMinutes && tripEndMinutes < nightStartTotalMinutes) {
          // Trip starts at night, ends during day
          const nightMinutes = (24 * 60 - tripStartMinutes) + nightEndTotalMinutes;
          nightHours = nightMinutes / 60;
          dayHours = (tripDurationMinutes - nightMinutes) / 60;
          isNightRateApplied = true;
        } else {
          // Trip starts at night, crosses day, ends at night
          const dayMinutes = nightStartTotalMinutes - nightEndTotalMinutes;
          dayHours = dayMinutes / 60;
          nightHours = (tripDurationMinutes - dayMinutes) / 60;
          isNightRateApplied = true;
        }
      } 
      // Trip starts after midnight, before night end
      else if (tripStartMinutes < nightEndTotalMinutes) {
        if (tripEndMinutes <= nightEndTotalMinutes) {
          // Trip entirely at night
          nightHours = tripDurationMinutes / 60;
          isNightRateApplied = true;
        } else if (tripEndMinutes < nightStartTotalMinutes) {
          // Trip starts at night, ends during day
          const nightMinutes = nightEndTotalMinutes - tripStartMinutes;
          nightHours = nightMinutes / 60;
          dayHours = (tripDurationMinutes - nightMinutes) / 60;
          isNightRateApplied = true;
        } else {
          // Trip starts at night, crosses day, ends at night
          const dayMinutes = nightStartTotalMinutes - nightEndTotalMinutes;
          dayHours = dayMinutes / 60;
          nightHours = (tripDurationMinutes - dayMinutes) / 60;
          isNightRateApplied = true;
        }
      }
      // Trip starts during day
      else if (tripStartMinutes < nightStartTotalMinutes) {
        if (tripEndMinutes >= nightStartTotalMinutes) {
          if (tripEndMinutes <= (24 * 60)) {
            // Trip starts during day, ends at night before midnight
            const dayMinutes = nightStartTotalMinutes - tripStartMinutes;
            dayHours = dayMinutes / 60;
            nightHours = (tripDurationMinutes - dayMinutes) / 60;
            isNightRateApplied = true;
          } else {
            // Trip starts during day, crosses midnight, ends at night
            const dayMinutes1 = nightStartTotalMinutes - tripStartMinutes;
            const nightMinutes1 = (24 * 60) - nightStartTotalMinutes;
            const nightMinutes2 = tripEndMinutes > nightEndTotalMinutes ? nightEndTotalMinutes : tripEndMinutes;
            dayHours = dayMinutes1 / 60;
            nightHours = (nightMinutes1 + nightMinutes2) / 60;
            isNightRateApplied = true;
          }
        }
      }
    } 
    // Standard night hours (night start < night end)
    else {
      // Check if trip overlaps with night hours
      const tripEndMinutesActual = tripStartMinutes + tripDurationMinutes;
      
      // No overlap with night
      if (tripEndMinutesActual <= nightStartTotalMinutes || tripStartMinutes >= nightEndTotalMinutes) {
        isNightRateApplied = false;
      }
      // Trip entirely at night
      else if (tripStartMinutes >= nightStartTotalMinutes && tripEndMinutesActual <= nightEndTotalMinutes) {
        nightHours = tripDurationMinutes / 60;
        isNightRateApplied = true;
      }
      // Trip starts during day, ends at night
      else if (tripStartMinutes < nightStartTotalMinutes && tripEndMinutesActual <= nightEndTotalMinutes) {
        const dayMinutes = nightStartTotalMinutes - tripStartMinutes;
        dayHours = dayMinutes / 60;
        nightHours = (tripDurationMinutes - dayMinutes) / 60;
        isNightRateApplied = true;
      }
      // Trip starts at night, ends during day
      else if (tripStartMinutes >= nightStartTotalMinutes && tripEndMinutesActual > nightEndTotalMinutes) {
        const nightMinutes = nightEndTotalMinutes - tripStartMinutes;
        nightHours = nightMinutes / 60;
        dayHours = (tripDurationMinutes - nightMinutes) / 60;
        isNightRateApplied = true;
      }
      // Trip starts during day, crosses night, ends during day
      else if (tripStartMinutes < nightStartTotalMinutes && tripEndMinutesActual > nightEndTotalMinutes) {
        const nightMinutes = nightEndTotalMinutes - nightStartTotalMinutes;
        nightHours = nightMinutes / 60;
        dayHours = (tripDurationMinutes - nightMinutes) / 60;
        isNightRateApplied = true;
      }
    }
  }
  
  // Check if the trip is on a Sunday
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
        <div className="h-[400px] rounded-lg overflow-hidden border">
          <RouteMap
            departure={departureCoordinates}
            destination={destinationCoordinates}
            returnDestination={returnToSameAddress ? undefined : returnCoordinates}
            showReturn={hasReturnTrip}
          />
        </div>
        
        <div className="space-y-4">
          <TripDetailsCard
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

export default QuoteSummary;
