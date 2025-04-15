
import { PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { isNightTime, isSunday, calculateNightDuration } from './timeUtils';

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
  
  const minDistance = selectedVehicleInfo.min_trip_distance || 0;
  const adjustedDistance = Math.max(estimatedDistance, minDistance);
  const adjustedReturnDistance = Math.max(returnDistance, minDistance);
  
  const hasMinDistanceWarning = estimatedDistance < minDistance && minDistance > 0;
  
  const isNightRate = isNightTime(date, time, selectedVehicleInfo, pricingSettings);
  
  const isSundayRate = isSunday(date);
  
  const nightRatePercentage = selectedVehicleInfo.night_rate_enabled ? 
    (selectedVehicleInfo.night_rate_percentage || 0) : 
    (pricingSettings?.night_rate_percentage || 0);
  
  const holidaySundayPercentage = selectedVehicleInfo.holiday_sunday_percentage !== undefined ?
    selectedVehicleInfo.holiday_sunday_percentage :
    (pricingSettings?.holiday_sunday_percentage || 0);
  
  const rideTime = time || "12:00";
  
  // Calcul de la durée du trajet aller et de la partie en tarif de nuit
  const oneWayDuration = estimatedDistance > 0 ? Math.max(10, estimatedDistance * 2) : 0;
  const nightDurationResult = 
    calculateNightDuration(date, rideTime, oneWayDuration, selectedVehicleInfo, pricingSettings);
  
  const oneWayNightMinutes = nightDurationResult.nightMinutes;
  const oneWayTotalMinutes = nightDurationResult.totalMinutes;
  const nightStartDisplay = nightDurationResult.nightStartDisplay;
  const nightEndDisplay = nightDurationResult.nightEndDisplay;
  
  // Calcul de la durée du trajet retour et de la partie en tarif de nuit si applicable
  let returnNightMinutes = 0;
  let returnTotalMinutes = 0;
  let returnNightStartDisplay = '';
  let returnNightEndDisplay = '';
  
  if (hasReturnTrip) {
    const returnStartTime = new Date(date);
    const [hours, minutes] = rideTime.split(':').map(Number);
    returnStartTime.setHours(hours);
    returnStartTime.setMinutes(minutes + oneWayDuration);
    
    const returnTimeStr = `${returnStartTime.getHours()}:${returnStartTime.getMinutes()}`;
    const returnDuration = returnToSameAddress ? oneWayDuration : (returnDistance > 0 ? Math.max(10, returnDistance * 2) : 0);
    
    const returnNightDuration = calculateNightDuration(
      returnStartTime, 
      returnTimeStr, 
      returnDuration, 
      selectedVehicleInfo, 
      pricingSettings
    );
    
    returnNightMinutes = returnNightDuration.nightMinutes;
    returnTotalMinutes = returnNightDuration.totalMinutes;
    returnNightStartDisplay = returnNightDuration.nightStartDisplay;
    returnNightEndDisplay = returnNightDuration.nightEndDisplay;
  }
  
  // Calcul de la proportion du trajet aller en tarif de nuit
  const oneWayNightProportion = oneWayTotalMinutes > 0 ? oneWayNightMinutes / oneWayTotalMinutes : 0;
  const returnNightProportion = returnTotalMinutes > 0 ? returnNightMinutes / returnTotalMinutes : 0;
  
  // Calcul des prix HT pour les trajets aller et retour
  let oneWayPriceHT = adjustedDistance * basePrice;
  let returnPriceHT = hasReturnTrip ? (returnToSameAddress ? adjustedDistance * basePrice : adjustedReturnDistance * basePrice) : 0;
  
  // Répartition du prix entre jour et nuit pour appliquer la majoration uniquement sur la partie nuit
  const oneWayNightPriceHT = oneWayPriceHT * oneWayNightProportion;
  const oneWayDayPriceHT = oneWayPriceHT - oneWayNightPriceHT;
  
  const returnNightPriceHT = returnPriceHT * returnNightProportion;
  const returnDayPriceHT = returnPriceHT - returnNightPriceHT;
  
  // Application de la majoration de nuit uniquement sur la portion de nuit
  let nightSurcharge = 0;
  if (nightRatePercentage > 0 && (oneWayNightMinutes > 0 || returnNightMinutes > 0)) {
    const nightSurchargeAmount = (oneWayNightPriceHT + returnNightPriceHT) * (nightRatePercentage / 100);
    nightSurcharge = nightSurchargeAmount;
    
    // Recalcul des prix avec la majoration de nuit
    oneWayPriceHT = oneWayDayPriceHT + oneWayNightPriceHT * (1 + nightRatePercentage / 100);
    returnPriceHT = returnDayPriceHT + returnNightPriceHT * (1 + nightRatePercentage / 100);
  }
  
  // Application de la majoration dimanche/jour férié sur l'ensemble du trajet
  let sundaySurcharge = 0;
  if (isSundayRate && holidaySundayPercentage > 0) {
    const sundayPercentage = holidaySundayPercentage / 100;
    sundaySurcharge = (oneWayPriceHT + returnPriceHT) * sundayPercentage;
    oneWayPriceHT += oneWayPriceHT * sundayPercentage;
    returnPriceHT += returnPriceHT * sundayPercentage;
  }
  
  // Application du tarif minimum si nécessaire
  const minimumTripFare = selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0);
  if (minimumTripFare > 0 && (oneWayPriceHT + returnPriceHT) < minimumTripFare) {
    const ratio = oneWayPriceHT / (oneWayPriceHT + returnPriceHT || 1);
    oneWayPriceHT = minimumTripFare * ratio;
    returnPriceHT = minimumTripFare * (1 - ratio);
  }
  
  const waitingTimePriceHT = hasWaitingTime ? waitingTimePrice : 0;
  
  // Application de la TVA
  const rideVatRate = pricingSettings?.ride_vat_rate !== undefined ? pricingSettings.ride_vat_rate : 10;
  const waitingVatRate = pricingSettings?.waiting_vat_rate !== undefined ? pricingSettings.waiting_vat_rate : 20;
  
  const oneWayPrice = oneWayPriceHT * (1 + (rideVatRate / 100));
  const returnPrice = returnPriceHT * (1 + (rideVatRate / 100));
  const waitingTimePriceTTC = waitingTimePriceHT * (1 + (waitingVatRate / 100));
  
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  
  const rideVAT = (oneWayPriceHT + returnPriceHT) * (rideVatRate / 100);
  const waitingVAT = waitingTimePriceHT * (waitingVatRate / 100);
  const totalVAT = rideVAT + waitingVAT;
  
  const totalPrice = totalPriceHT + totalVAT;
  
  const nightHours = (oneWayNightMinutes + returnNightMinutes) / 60;
  
  // Create a combined night start/end display that includes both one-way and return
  const combinedNightStartDisplay = nightStartDisplay + (returnNightStartDisplay ? ` / ${returnNightStartDisplay}` : '');
  const combinedNightEndDisplay = nightEndDisplay + (returnNightEndDisplay ? ` / ${returnNightEndDisplay}` : '');
  
  console.log('Night calculation details:', {
    oneWayNightMinutes,
    oneWayTotalMinutes,
    oneWayNightProportion,
    oneWayNightPriceHT,
    nightRatePercentage,
    nightSurcharge,
    oneWayPriceHT,
    returnPriceHT,
    totalPriceHT
  });
  
  return {
    basePrice,
    isNightRate: oneWayNightMinutes > 0 || returnNightMinutes > 0,
    isSunday: isSundayRate,
    oneWayPriceHT,
    oneWayPrice,
    returnPriceHT,
    returnPrice,
    waitingTimePriceHT,
    waitingTimePrice: waitingTimePriceTTC,
    totalPriceHT,
    totalVAT,
    totalPrice,
    nightSurcharge,
    sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning,
    minDistance,
    nightMinutes: oneWayNightMinutes + returnNightMinutes,
    totalMinutes: oneWayTotalMinutes + returnTotalMinutes,
    nightRatePercentage,
    nightHours,
    nightStartDisplay: combinedNightStartDisplay,
    nightEndDisplay: combinedNightEndDisplay
  };
};
