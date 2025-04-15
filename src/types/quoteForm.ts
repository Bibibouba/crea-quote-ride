
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
  oneWayPrice: number;
  returnPrice: number;
  waitingTimePrice: number;
  totalPrice: number;
  nightSurcharge: number;
  basePrice?: number;
  isNightRate?: boolean;
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
  nightRatePercentage?: number;
  nightHours?: number;
  dayHours?: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
  sundayRate?: number;
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
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
  // Examples of existing fields
  estimatedDistance: number;
  estimatedDuration: number;
  amount: number;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number];
  destinationCoordinates: [number, number];
  time: string;
  date: Date;

  // New fields for day/night rate details
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
}

export type QuoteFormState = ReturnType<typeof useQuoteForm>;

export type QuoteDetailsTypeOptional = Partial<QuoteDetailsType>;
