
import { useQuoteForm } from "@/hooks/useQuoteForm";

export interface Vehicle {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  description: string;
  min_trip_distance?: number;
  night_rate_enabled?: boolean;
  night_rate_start?: string;
  night_rate_end?: string;
  night_rate_percentage?: number;
  wait_price_per_15min?: number;
  wait_night_enabled?: boolean;
  wait_night_start?: string;
  wait_night_end?: string;
  wait_night_percentage?: number;
  minimum_trip_fare?: number;
  holiday_sunday_percentage?: number;
}

export interface PricingSettings {
  id?: string;
  base_fare?: number;
  price_per_km?: number;
  waiting_fee_per_minute?: number;
  min_fare?: number;
  night_rate_enabled?: boolean;
  night_rate_start?: string;
  night_rate_end?: string;
  night_rate_percentage?: number;
  wait_price_per_15min?: number;
  wait_night_enabled?: boolean;
  wait_night_start?: string;
  wait_night_end?: string;
  wait_night_percentage?: number;
  minimum_trip_fare?: number;
  holiday_sunday_percentage?: number;
  minimum_trip_minutes?: number;
  service_area?: string;
  ride_vat_rate?: number;
  waiting_vat_rate?: number;
}

export interface QuoteDetails {
  basePrice?: number;
  isNightRate?: boolean;
  isSunday?: boolean;
  oneWayPriceHT?: number;
  returnPriceHT?: number;
  waitingTimePriceHT?: number;
  totalPriceHT?: number;
  totalVAT?: number;
  oneWayPrice: number;
  returnPrice: number;
  waitingTimePrice: number;
  totalPrice: number;
  nightSurcharge: number;
  sundaySurcharge?: number;
  rideVatRate?: number;
  waitingVatRate?: number;
  hasMinDistanceWarning?: boolean;
  minDistance?: number;
  nightMinutes?: number;
  totalMinutes?: number;
  nightRatePercentage?: number;
  nightHours?: number;
  dayHours?: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  sundayRate?: number;
  waitTimeDay?: number;
  waitTimeNight?: number;
  waitPriceDay?: number;
  waitPriceNight?: number;
  // New fields for compatibility with database schema
  amount_ht?: number;
  one_way_price_ht?: number;
  return_price_ht?: number;
  one_way_price?: number;
  return_price?: number;
  dayPercentage?: number;
  nightPercentage?: number;
}

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export interface QuoteFormStateProps {
  clientId?: string;
  onSuccess?: () => void;
}

export interface QuoteDetailsType {
  estimatedDistance: number;
  estimatedDuration: number;
  amount: number;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number];
  destinationCoordinates: [number, number];
  time: string;
  date: Date;
  // Fields matching database schema
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  nightSurcharge?: number;
  isNightRate?: boolean;
  nightRatePercentage?: number;
  nightHours?: number;
  dayHours?: number;
  basePrice?: number;
  isSunday?: boolean;
  oneWayPriceHT?: number;
  returnPriceHT?: number;
  waitingTimePriceHT?: number;
  totalPriceHT?: number;
  totalVAT?: number;
  sundaySurcharge?: number;
  rideVatRate?: number;
  waitingVatRate?: number;
  hasMinDistanceWarning?: boolean;
  minDistance?: number;
  nightMinutes?: number;
  totalMinutes?: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
  sundayRate?: number;
  waitTimeDay?: number;
  waitTimeNight?: number;
  waitPriceDay?: number;
  waitPriceNight?: number;
  // Fields for compatibility with QuoteDetails
  oneWayPrice?: number;
  returnPrice?: number;
  waitingTimePrice?: number;
  totalPrice?: number;
  amount_ht?: number;
  one_way_price_ht?: number;
  return_price_ht?: number;
  one_way_price?: number;
  return_price?: number;
  // Ajout des propriétés manquantes
  dayPercentage?: number;
  nightPercentage?: number;
}

export type QuoteFormState = ReturnType<typeof useQuoteForm>;

export type QuoteDetailsTypeOptional = Partial<QuoteDetailsType>;
