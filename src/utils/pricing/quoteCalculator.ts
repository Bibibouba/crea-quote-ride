
import { PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { isNightTime, isSunday, calculateNightDuration, calculateDayNightKmSplit } from './timeUtils';
import { calculateNightSurcharge } from './nightRateCalculator';
import { calculateSundaySurcharge } from './sundayRateCalculator';
import { applyMinimumFare } from './minFareCalculator';
import { calculateVatAndTotalPrices } from './vatCalculator';
import { calculateDetailedWaitingPrice } from './calculateWaitingTimePrice';
import { calculateNewQuoteDetails, QuoteCalculationInput } from './newQuoteCalculator';

/**
 * Calculates detailed quote information based on trip parameters
 */
export const calculateQuoteDetails = (
  selectedVehicle: string,
  estimatedDistance: number,
  returnDistance: number,
  hasReturnTrip: boolean,
  returnToSameAddress: boolean,
  vehicles: any[],
  hasWaitingTime: boolean,
  waitingTimePrice: number,
  time: string,
  date: Date,
  pricingSettings: PricingSettings | null
): QuoteDetails | null => {
  if (!selectedVehicle || estimatedDistance === 0) return null;
  
  const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
  if (!selectedVehicleInfo) return null;
  
  const basePrice = selectedVehicleInfo.basePrice;
  
  // Paramètres pour les tests et débogage
  console.log('Quote calculation input:', {
    estimatedDistance,
    returnDistance,
    hasReturnTrip,
    returnToSameAddress,
    time,
    date: date.toISOString(),
    basePrice,
    selectedVehicleId: selectedVehicle
  });
  
  // Récupérer les valeurs de configuration pour le véhicule sélectionné
  const vehicleSettings = {
    price_per_km: basePrice,
    minimum_trip_fare: selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0),
    min_trip_distance: selectedVehicleInfo.min_trip_distance || 0,
    night_rate_enabled: selectedVehicleInfo.night_rate_enabled || pricingSettings?.night_rate_enabled || false,
    night_rate_start: selectedVehicleInfo.night_rate_start || pricingSettings?.night_rate_start || "20:00",
    night_rate_end: selectedVehicleInfo.night_rate_end || pricingSettings?.night_rate_end || "06:00",
    night_rate_percentage: selectedVehicleInfo.night_rate_percentage || pricingSettings?.night_rate_percentage || 0,
    wait_price_per_15min: selectedVehicleInfo.wait_price_per_15min || pricingSettings?.wait_price_per_15min || 7.5,
    wait_night_enabled: selectedVehicleInfo.wait_night_enabled || pricingSettings?.wait_night_enabled || false, 
    wait_night_start: selectedVehicleInfo.wait_night_start || pricingSettings?.wait_night_start || "20:00",
    wait_night_end: selectedVehicleInfo.wait_night_end || pricingSettings?.wait_night_end || "06:00",
    wait_night_percentage: selectedVehicleInfo.wait_night_percentage || pricingSettings?.wait_night_percentage || 0,
    holiday_sunday_percentage: selectedVehicleInfo.holiday_sunday_percentage || pricingSettings?.holiday_sunday_percentage || 0
  };
  
  // Calculer la durée du trajet en minutes (approx. 2 min par km)
  const oneWayDuration = estimatedDistance > 0 ? Math.max(10, Math.ceil(estimatedDistance * 2)) : 0;
  
  // Préparer les entrées pour le nouveau calculateur
  const quoteInput: QuoteCalculationInput = {
    vehicleSettings,
    distanceKm: estimatedDistance,
    durationMinutes: oneWayDuration,
    waitTimeMinutes: hasWaitingTime ? Math.max(0, waitingTimePrice / (vehicleSettings.wait_price_per_15min) * 15) : 0,
    departureTime: time || "12:00",
    departureDate: date,
    hasReturnTrip,
    returnToSameAddress,
    returnDistance
  };
  
  // Utiliser le nouveau calculateur
  const result = calculateNewQuoteDetails(quoteInput);
  
  // Convertir le résultat en format QuoteDetails compatible avec le reste de l'application
  const quoteDetails: QuoteDetails = {
    basePrice,
    isNightRate: result.isNightRate,
    isSunday: result.isSunday,
    oneWayPriceHT: result.oneWayPriceHT,
    oneWayPrice: result.oneWayPrice,
    returnPriceHT: result.oneWayPriceHT,  // À adapter pour les trajets retour
    returnPrice: result.oneWayPrice,       // À adapter pour les trajets retour
    waitingTimePriceHT: result.waitingTimePriceHT,
    waitingTimePrice: result.waitingTimePrice,
    totalPriceHT: result.totalPriceHT,
    totalVAT: result.totalVAT,
    totalPrice: result.totalPrice,
    nightSurcharge: result.nightSurcharge,
    sundaySurcharge: result.sundaySurcharge,
    rideVatRate: result.rideVatRate,
    waitingVatRate: result.waitingVatRate,
    hasMinDistanceWarning: result.hasMinDistanceWarning,
    minDistance: result.minDistance,
    nightMinutes: result.nightMinutes,
    totalMinutes: result.totalMinutes,
    nightRatePercentage: result.nightRatePercentage,
    nightHours: result.nightHours,
    dayHours: result.dayHours,
    nightStartDisplay: result.nightStartDisplay,
    nightEndDisplay: result.nightEndDisplay,
    dayKm: result.dayKm,
    nightKm: result.nightKm, 
    totalKm: result.totalKm,
    dayPrice: result.dayPrice,
    nightPrice: result.nightPrice,
    sundayRate: result.sundayRate,
    waitTimeDay: result.waitTimeDay,
    waitTimeNight: result.waitTimeNight,
    waitPriceDay: result.waitPriceDay,
    waitPriceNight: result.waitPriceNight
  };
  
  // Log détaillé des calculs pour débogage
  console.log('New quote calculation details:', result);
  
  return quoteDetails;
};
