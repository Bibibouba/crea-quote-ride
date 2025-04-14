import { useQuoteForm } from "@/hooks/useQuoteForm";

export interface Vehicle {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  description: string;
}

export interface PricingSettings {
  base_price_per_km: number;
  night_percentage: number;
  night_start: string;
  night_end: string;
  waiting_fee_per_minute: number;
  wait_night_enabled: boolean;
  wait_night_percentage: number;
  wait_price_per_15min: number;
}

export interface QuoteDetails {
  oneWayPrice: number;
  returnPrice: number;
  waitingTimePrice: number;
  totalPrice: number;
  nightSurcharge: number;
}

export interface WaitingTimeOption {
  value: number;
  label: string;
}

export interface QuoteFormStateProps {
  clientId?: string;
  onSuccess?: () => void;
}

export type QuoteFormState = ReturnType<typeof useQuoteForm>;
