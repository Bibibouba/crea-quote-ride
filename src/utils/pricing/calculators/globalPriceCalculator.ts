
import { Vehicle, PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { calculateTripPrice } from './tripPriceCalculator';
import { calculateMinFare } from './minFareCalculator';
import { calculateSundayRate } from './sundayRateCalculator';
import { calculateVAT } from './vatCalculator';

export const calculateGlobalPrice = (
  date: Date,
  oneWayPrice: number,
  returnPrice: number,
  waitingTimePrice: number,
  selectedVehicle: Vehicle,
  pricingSettings: PricingSettings,
  isSunday: boolean
): {
  totalPriceHT: number;
  totalVAT: number;
  totalPrice: number;
  sundaySurcharge: number;
} => {
  // Calculate base total before Sunday rate
  const baseTotalHT = oneWayPrice + returnPrice + waitingTimePrice;

  // Apply Sunday rate if applicable
  const sundayRate = selectedVehicle.holiday_sunday_percentage || pricingSettings.holiday_sunday_percentage || 0;
  const { sundaySurcharge, totalWithSunday } = calculateSundayRate(baseTotalHT, isSunday, sundayRate);

  // Apply minimum fare
  const minFare = selectedVehicle.minimum_trip_fare || pricingSettings.minimum_trip_fare || 0;
  const { finalPrice: totalPriceHT } = calculateMinFare(totalWithSunday, minFare);

  // Calculate VAT
  const rideVatRate = pricingSettings.ride_vat_rate || 10;
  const totalVAT = calculateVAT(totalPriceHT, rideVatRate, false);
  const totalPrice = totalPriceHT + totalVAT;

  return {
    totalPriceHT,
    totalVAT,
    totalPrice,
    sundaySurcharge
  };
};
