
import { Address } from '@/hooks/useMapbox';

export interface PricingSettings {
  id: string;
  base_fare: number;
  price_per_km: number;
  waiting_fee_per_minute: number;
  min_fare: number;
  night_rate_enabled: boolean | null;
  night_rate_start: string | null;
  night_rate_end: string | null;
  night_rate_percentage: number | null;
  wait_price_per_15min: number | null;
  wait_night_enabled: boolean | null;
  wait_night_start: string | null;
  wait_night_end: string | null;
  wait_night_percentage: number | null;
  minimum_trip_fare: number | null;
  holiday_sunday_percentage: number | null;
  minimum_trip_minutes: number | null;
  service_area: string | null;
  ride_vat_rate?: number;
  waiting_vat_rate?: number;
}

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export interface Vehicle {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  description: string;
}

export interface QuoteDetails {
  basePrice: number;
  isNightRate: boolean;
  isSunday: boolean;
  oneWayPriceHT: number;
  oneWayPrice: number;
  returnPriceHT: number;
  returnPrice: number;
  waitingTimePriceHT: number;
  waitingTimePrice: number;
  totalPriceHT: number;
  totalVAT: number;
  totalPrice: number;
  nightSurcharge: number;
  sundaySurcharge: number;
  rideVatRate: number;
  waitingVatRate: number;
}

export interface QuoteFormState {
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date: Date;
  time: string;
  selectedVehicle: string;
  passengers: string;
  estimatedDistance: number;
  estimatedDuration: number;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  customReturnCoordinates?: [number, number];
  returnDistance: number;
  returnDuration: number;
  currentStep: number;
  showQuote: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  isQuoteSent: boolean;
  selectedClient: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  quoteDetails: QuoteDetails | null;
}
