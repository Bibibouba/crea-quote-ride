
import { PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { isNightTime, isSunday, calculateNightDuration, calculateDayNightKmSplit } from './timeUtils';
import { calculateNightSurcharge } from './nightRateCalculator';
import { calculateSundaySurcharge } from './sundayRateCalculator';
import { applyMinimumFare } from './minFareCalculator';
import { calculateVatAndTotalPrices } from './vatCalculator';
import { calculateDetailedWaitingPrice } from './calculateWaitingTimePrice';

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
  
  const minDistance = selectedVehicleInfo.min_trip_distance || 0;
  const adjustedDistance = Math.max(estimatedDistance, minDistance);
  const adjustedReturnDistance = Math.max(returnDistance, minDistance);
  
  const hasMinDistanceWarning = estimatedDistance < minDistance && minDistance > 0;
  
  const isNightRateEnabled = selectedVehicleInfo.night_rate_enabled || pricingSettings?.night_rate_enabled;
  const isNightRateActive = isNightRateEnabled && isNightTime(date, time, selectedVehicleInfo, pricingSettings);
  
  const isSundayRate = isSunday(date);
  
  const nightRatePercentage = selectedVehicleInfo.night_rate_enabled ? 
    (selectedVehicleInfo.night_rate_percentage || 0) : 
    (pricingSettings?.night_rate_percentage || 0);
  
  const holidaySundayPercentage = selectedVehicleInfo.holiday_sunday_percentage !== undefined ?
    selectedVehicleInfo.holiday_sunday_percentage :
    (pricingSettings?.holiday_sunday_percentage || 0);
  
  const rideTime = time || "12:00";
  
  // Calculer la durée du trajet en minutes (approx. 2 min par km)
  const oneWayDuration = estimatedDistance > 0 ? Math.max(10, Math.ceil(estimatedDistance * 2)) : 0;
  
  // Calculer la proportion jour/nuit pour le trajet aller
  const nightDurationResult = 
    calculateNightDuration(date, rideTime, oneWayDuration, selectedVehicleInfo, pricingSettings);
  
  const oneWayNightMinutes = nightDurationResult.nightMinutes;
  const oneWayTotalMinutes = nightDurationResult.totalMinutes;
  const nightStartDisplay = nightDurationResult.nightStartDisplay;
  const nightEndDisplay = nightDurationResult.nightEndDisplay;
  
  // Calculer la durée du trajet de retour si applicable
  let returnNightMinutes = 0;
  let returnTotalMinutes = 0;
  let returnNightStartDisplay = '';
  let returnNightEndDisplay = '';
  
  if (hasReturnTrip) {
    const returnStartTime = new Date(date);
    const [hours, minutes] = rideTime.split(':').map(Number);
    returnStartTime.setHours(hours);
    returnStartTime.setMinutes(minutes + oneWayDuration);
    
    const returnTimeStr = `${returnStartTime.getHours().toString().padStart(2, '0')}:${returnStartTime.getMinutes().toString().padStart(2, '0')}`;
    const returnDuration = returnToSameAddress ? oneWayDuration : (returnDistance > 0 ? Math.max(10, Math.ceil(returnDistance * 2)) : 0);
    
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
  
  // Répartir les kilomètres en fonction de la proportion de temps
  const oneWaySplit = calculateDayNightKmSplit(adjustedDistance, oneWayNightMinutes, oneWayTotalMinutes);
  let returnSplit = { dayKm: 0, nightKm: 0, totalKm: 0 };
  
  if (hasReturnTrip) {
    const returnAdjustedDistance = returnToSameAddress ? adjustedDistance : adjustedReturnDistance;
    returnSplit = calculateDayNightKmSplit(returnAdjustedDistance, returnNightMinutes, returnTotalMinutes);
  }
  
  // Calculer le prix total pour le jour et la nuit
  const dayKm = oneWaySplit.dayKm + returnSplit.dayKm;
  const nightKm = oneWaySplit.nightKm + returnSplit.nightKm;
  const totalKm = oneWaySplit.totalKm + returnSplit.totalKm;
  
  const dayPrice = dayKm * basePrice;
  const nightPrice = nightKm * basePrice * (1 + (nightRatePercentage / 100));
  
  // Calculer le temps d'attente avec répartition jour/nuit
  const waitingTimeDetails = hasWaitingTime ? 
    calculateDetailedWaitingPrice(
      hasWaitingTime, 
      hasWaitingTime ? Math.max(0, waitingTimePrice / (selectedVehicleInfo.wait_price_per_15min || pricingSettings?.wait_price_per_15min || 7.5) * 15) : 0, 
      pricingSettings, 
      time, 
      date, 
      selectedVehicleInfo
    ) : 
    { waitTimeDay: 0, waitTimeNight: 0, waitPriceDay: 0, waitPriceNight: 0, totalWaitPrice: 0 };
  
  // Appliquer majoration dimanche/jour férié si applicable
  const sundaySurcharge = isSundayRate ? 
    (dayPrice + nightPrice + waitingTimeDetails.totalWaitPrice) * (holidaySundayPercentage / 100) : 
    0;
  
  // Calculer les prix aller et retour séparément
  const oneWayDayPrice = oneWaySplit.dayKm * basePrice;
  const oneWayNightPrice = oneWaySplit.nightKm * basePrice * (1 + (nightRatePercentage / 100));
  const oneWayPrice = oneWayDayPrice + oneWayNightPrice;
  
  const returnDayPrice = returnSplit.dayKm * basePrice;
  const returnNightPrice = returnSplit.nightKm * basePrice * (1 + (nightRatePercentage / 100));
  const returnPrice = returnDayPrice + returnNightPrice;
  
  // Calculer la TVA et les prix finaux
  const rideVatRate = pricingSettings?.ride_vat_rate !== undefined ? pricingSettings.ride_vat_rate : 10;
  const waitingVatRate = pricingSettings?.waiting_vat_rate !== undefined ? pricingSettings.waiting_vat_rate : 20;
  
  const subTotalHT = dayPrice + nightPrice + waitingTimeDetails.totalWaitPrice + sundaySurcharge;
  const rideVat = (dayPrice + nightPrice + sundaySurcharge) * (rideVatRate / 100);
  const waitingVat = waitingTimeDetails.totalWaitPrice * (waitingVatRate / 100);
  const totalVat = rideVat + waitingVat;
  const totalTTC = subTotalHT + totalVat;
  
  // Appliquer le tarif minimum si applicable
  const minimumTripFare = selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0);
  const finalTotalTTC = Math.max(totalTTC, minimumTripFare);
  
  // Calcul des heures de jour et de nuit
  const nightHours = (oneWayNightMinutes + returnNightMinutes) / 60;
  const dayHours = (oneWayTotalMinutes + returnTotalMinutes - oneWayNightMinutes - returnNightMinutes) / 60;
  
  // Log détaillé des calculs pour débogage
  console.log('Quote calculation details:', {
    dayKm,
    nightKm,
    totalKm,
    dayPrice,
    nightPrice,
    waitingTimePrice: waitingTimeDetails.totalWaitPrice,
    sundaySurcharge,
    totalHT: subTotalHT,
    totalVAT: totalVat,
    totalTTC: finalTotalTTC,
    isNightRateActive,
    oneWayNightMinutes,
    returnNightMinutes,
    nightHours,
    dayHours
  });
  
  return {
    basePrice,
    isNightRate: oneWayNightMinutes > 0 || returnNightMinutes > 0,
    isSunday: isSundayRate,
    oneWayPriceHT: oneWayPrice,
    oneWayPrice: oneWayPrice * (1 + (rideVatRate / 100)),
    returnPriceHT: returnPrice,
    returnPrice: returnPrice * (1 + (rideVatRate / 100)),
    waitingTimePriceHT: waitingTimeDetails.totalWaitPrice,
    waitingTimePrice: waitingTimeDetails.totalWaitPrice * (1 + (waitingVatRate / 100)),
    totalPriceHT: subTotalHT,
    totalVAT: totalVat,
    totalPrice: finalTotalTTC,
    nightSurcharge: nightPrice - (nightKm * basePrice), // Surcoût dû à la nuit
    sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning,
    minDistance,
    nightMinutes: oneWayNightMinutes + returnNightMinutes,
    totalMinutes: oneWayTotalMinutes + returnTotalMinutes,
    nightRatePercentage,
    nightHours,
    dayHours,
    nightStartDisplay,
    nightEndDisplay,
    dayKm,
    nightKm, 
    totalKm,
    dayPrice,
    nightPrice,
    sundayRate: holidaySundayPercentage,
    waitTimeDay: waitingTimeDetails.waitTimeDay,
    waitTimeNight: waitingTimeDetails.waitTimeNight,
    waitPriceDay: waitingTimeDetails.waitPriceDay,
    waitPriceNight: waitingTimeDetails.waitPriceNight
  };
};
