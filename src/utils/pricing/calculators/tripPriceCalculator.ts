
import { calculateDayNightKmSplit } from '../timeUtils';
import { calculateNightRate } from './nightRateCalculator';
import { calculateSundayRate } from './sundayRateCalculator';
import { Vehicle, PricingSettings } from '@/types/quoteForm';

interface TripPricingResult {
  dayKm: number;
  nightKm: number;
  dayPrice: number;
  nightPrice: number;
  nightSurcharge: number;
  totalPriceWithNightRate: number;
  dayPercentage: number;
  nightPercentage: number;
  nightHours: number;
  dayHours: number;
  totalKm: number;
  isNightRate: boolean;
  nightRatePercentage: number;
}

export const calculateTripPrice = (
  startTime: Date,
  distance: number,
  selectedVehicle: Vehicle,
  pricingSettings: PricingSettings
): TripPricingResult => {
  const daySplit = calculateDayNightKmSplit(
    startTime,
    distance,
    selectedVehicle.night_rate_start || pricingSettings.night_rate_start || "20:00",
    selectedVehicle.night_rate_end || pricingSettings.night_rate_end || "06:00"
  );

  const basePrice = selectedVehicle.basePrice || pricingSettings.base_fare || 0;

  const nightRateResult = calculateNightRate(
    basePrice,
    daySplit.dayKm,
    daySplit.nightKm,
    selectedVehicle.night_rate_enabled || pricingSettings.night_rate_enabled || false,
    selectedVehicle.night_rate_percentage || pricingSettings.night_rate_percentage || 0
  );

  return {
    ...daySplit,
    ...nightRateResult,
    totalPriceWithNightRate: nightRateResult.totalWithNightRate
  };
};
