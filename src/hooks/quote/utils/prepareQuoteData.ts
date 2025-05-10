
import { Quote } from '@/types/quote';
import { QuoteDetailsType } from '@/types/quoteForm';

/**
 * Interface pour les paramètres de préparation des données de devis
 */
export interface PrepareQuoteDataParams {
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
 * Prépare les données de devis pour l'envoi à la base de données
 * @param params Les paramètres nécessaires pour créer un devis
 * @returns Un objet Quote prêt à être enregistré
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
}: PrepareQuoteDataParams): Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf" | "vehicles" | "clients"> => {
  
  if (!quoteDetails) {
    throw new Error("Les détails du devis sont obligatoires");
  }
  
  // Construction de l'objet quoteData avec toutes les propriétés obligatoires du type Quote
  const quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf" | "vehicles" | "clients"> = {
    driver_id: driverId,
    client_id: clientId,
    vehicle_id: selectedVehicle,
    departure_location: departureAddress,
    arrival_location: destinationAddress,
    departure_coordinates: departureCoordinates || [0, 0],
    arrival_coordinates: destinationCoordinates || [0, 0],
    distance_km: estimatedDistance,
    duration_minutes: estimatedDuration,
    ride_date: dateTime.toISOString(),
    amount: quoteDetails.totalPrice || 0,
    status: "pending",
    
    // Propriétés liées au trajet
    has_return_trip: hasReturnTrip,
    has_waiting_time: hasWaitingTime,
    waiting_time_minutes: waitingTimeMinutes || 0,
    waiting_time_price: waitingTimePrice || 0,
    return_to_same_address: returnToSameAddress,
    custom_return_address: customReturnAddress || '',
    return_coordinates: customReturnCoordinates,
    return_distance_km: returnDistance || 0,
    return_duration_minutes: returnDuration || 0,
    
    // Propriétés liées au calcul de prix
    day_km: quoteDetails.dayKm || 0,
    night_km: quoteDetails.nightKm || 0,
    total_km: quoteDetails.totalKm || 0,
    day_price: quoteDetails.dayPrice || 0,
    night_price: quoteDetails.nightPrice || 0,
    night_surcharge: quoteDetails.nightSurcharge || 0,
    has_night_rate: quoteDetails.isNightRate || false,
    night_hours: quoteDetails.nightHours || 0,
    night_rate_percentage: quoteDetails.nightRatePercentage || 0,
    is_sunday_holiday: quoteDetails.isSunday || false,
    sunday_holiday_percentage: quoteDetails.sundayRate || 0,
    sunday_holiday_surcharge: quoteDetails.sundaySurcharge || 0,
    wait_time_day: quoteDetails.waitTimeDay || 0,
    wait_time_night: quoteDetails.waitTimeNight || 0,
    wait_price_day: quoteDetails.waitPriceDay || 0,
    wait_price_night: quoteDetails.waitPriceNight || 0,
    
    // Propriétés liées aux montants
    amount_ht: quoteDetails.totalPriceHT || 0, 
    total_ht: quoteDetails.totalPriceHT || 0,
    vat: quoteDetails.totalVAT || 0,
    total_ttc: quoteDetails.totalPrice || 0,
    one_way_price_ht: quoteDetails.oneWayPriceHT || 0,
    one_way_price: quoteDetails.oneWayPrice || 0,
    return_price_ht: quoteDetails.returnPriceHT || 0,
    return_price: quoteDetails.returnPrice || 0,
    day_hours: quoteDetails.dayHours || 0
  };
  
  return quoteData;
};
