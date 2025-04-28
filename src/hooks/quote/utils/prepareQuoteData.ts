
import { Quote } from '@/types/quote';
import { PricingSettings, Vehicle, QuoteDetailsType } from '@/types/quoteForm';

interface PrepareQuoteDataParams {
  driverId: string;
  clientId: string;
  selectedVehicle: string;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  dateTime: Date;
  estimatedDistance: number;
  estimatedDuration: number;
  quoteDetails: QuoteDetailsType;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  customReturnCoordinates?: [number, number];
  returnDistance: number;
  returnDuration: number;
}

/**
 * Prepares quote data for submission to the database
 */
export const prepareQuoteData = ({
  driverId,
  clientId,
  selectedVehicle,
  departureAddress,
  destinationAddress,
  departureCoordinates,
  destinationCoordinates,
  dateTime,
  estimatedDistance,
  estimatedDuration,
  quoteDetails,
  hasReturnTrip,
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  returnToSameAddress,
  customReturnAddress,
  customReturnCoordinates,
  returnDistance,
  returnDuration
}: PrepareQuoteDataParams): Partial<Quote> => {
  
  if (!quoteDetails) {
    throw new Error("Quote details are required");
  }
  
  const quoteData: Partial<Quote> = {
    driver_id: driverId,
    client_id: clientId,
    vehicle_id: selectedVehicle,
    departure_location: departureAddress,
    arrival_location: destinationAddress,
    departure_coordinates: departureCoordinates,
    arrival_coordinates: destinationCoordinates,
    distance_km: estimatedDistance,
    duration_minutes: estimatedDuration,
    ride_date: dateTime.toISOString(),
    amount: quoteDetails.totalPrice,
    status: "pending",
    has_return_trip: hasReturnTrip,
    has_waiting_time: hasWaitingTime,
    waiting_time_minutes: hasWaitingTime ? waitingTimeMinutes : 0,
    waiting_time_price: hasWaitingTime ? waitingTimePrice : 0,
    return_to_same_address: returnToSameAddress,
    custom_return_address: customReturnAddress,
    return_coordinates: customReturnCoordinates,
    return_distance_km: returnDistance,
    return_duration_minutes: returnDuration,
    day_km: quoteDetails.dayKm,
    night_km: quoteDetails.nightKm,
    total_km: quoteDetails.totalKm,
    day_price: quoteDetails.dayPrice,
    night_price: quoteDetails.nightPrice,
    night_surcharge: quoteDetails.nightSurcharge,
    has_night_rate: quoteDetails.isNightRate,
    night_hours: quoteDetails.nightHours,
    night_rate_percentage: quoteDetails.nightRatePercentage,
    is_sunday_holiday: quoteDetails.isSunday,
    sunday_holiday_percentage: quoteDetails.sundayRate,
    sunday_holiday_surcharge: quoteDetails.sundaySurcharge,
    wait_time_day: quoteDetails.waitTimeDay,
    wait_time_night: quoteDetails.waitTimeNight,
    wait_price_day: quoteDetails.waitPriceDay,
    wait_price_night: quoteDetails.waitPriceNight,
    amount_ht: quoteDetails.totalPriceHT,
    total_ttc: quoteDetails.totalPrice
  };
  
  return quoteData;
};
