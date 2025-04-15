
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
  
  const minDistance = selectedVehicleInfo.min_trip_distance || 0;
  const adjustedDistance = Math.max(estimatedDistance, minDistance);
  const adjustedReturnDistance = Math.max(returnDistance, minDistance);
  
  const hasMinDistanceWarning = estimatedDistance < minDistance && minDistance > 0;
  
  const isNightRateEnabled = selectedVehicleInfo.night_rate_enabled || pricingSettings?.night_rate_enabled;
  const isNightRate = isNightRateEnabled && isNightTime(date, time, selectedVehicleInfo, pricingSettings);
  
  const isSundayRate = isSunday(date);
  
  const nightRatePercentage = selectedVehicleInfo.night_rate_enabled ? 
    (selectedVehicleInfo.night_rate_percentage || 0) : 
    (pricingSettings?.night_rate_percentage || 0);
  
  const holidaySundayPercentage = selectedVehicleInfo.holiday_sunday_percentage !== undefined ?
    selectedVehicleInfo.holiday_sunday_percentage :
    (pricingSettings?.holiday_sunday_percentage || 0);
  
  const rideTime = time || "12:00";
  
  // Calculate one-way trip duration and night portion
  const oneWayDuration = estimatedDistance > 0 ? Math.max(10, estimatedDistance * 2) : 0;
  const nightDurationResult = 
    calculateNightDuration(date, rideTime, oneWayDuration, selectedVehicleInfo, pricingSettings);
  
  const oneWayNightMinutes = nightDurationResult.nightMinutes;
  const oneWayTotalMinutes = nightDurationResult.totalMinutes;
  const nightStartDisplay = nightDurationResult.nightStartDisplay;
  const nightEndDisplay = nightDurationResult.nightEndDisplay;
  
  // Calculate return trip night duration if applicable
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
  
  // Calculate day/night km split based on night minutes proportion
  const oneWaySplit = calculateDayNightKmSplit(adjustedDistance, oneWayNightMinutes, oneWayTotalMinutes);
  let returnSplit = { dayKm: 0, nightKm: 0, totalKm: 0 };
  
  if (hasReturnTrip) {
    const returnAdjustedDistance = returnToSameAddress ? adjustedDistance : adjustedReturnDistance;
    returnSplit = calculateDayNightKmSplit(returnAdjustedDistance, returnNightMinutes, returnTotalMinutes);
  }
  
  // Calculate day and night prices
  const dayKm = oneWaySplit.dayKm + returnSplit.dayKm;
  const nightKm = oneWaySplit.nightKm + returnSplit.nightKm;
  const totalKm = oneWaySplit.totalKm + returnSplit.totalKm;
  
  const dayPrice = dayKm * basePrice;
  const nightPrice = nightKm * basePrice * (1 + (nightRatePercentage / 100));
  
  // Calculate waiting time with day/night split
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
  
  // Apply Sunday/holiday surcharge if applicable
  const sundaySurcharge = isSundayRate ? 
    (dayPrice + nightPrice + waitingTimeDetails.totalWaitPrice) * (holidaySundayPercentage / 100) : 
    0;
  
  // Calculate one-way and return prices separately
  const oneWayDayPrice = oneWaySplit.dayKm * basePrice;
  const oneWayNightPrice = oneWaySplit.nightKm * basePrice * (1 + (nightRatePercentage / 100));
  const oneWayPrice = oneWayDayPrice + oneWayNightPrice;
  
  const returnDayPrice = returnSplit.dayKm * basePrice;
  const returnNightPrice = returnSplit.nightKm * basePrice * (1 + (nightRatePercentage / 100));
  const returnPrice = returnDayPrice + returnNightPrice;
  
  // Calculate VAT and final prices
  const rideVatRate = pricingSettings?.ride_vat_rate !== undefined ? pricingSettings.ride_vat_rate : 10;
  const waitingVatRate = pricingSettings?.waiting_vat_rate !== undefined ? pricingSettings.waiting_vat_rate : 20;
  
  const subTotalHT = dayPrice + nightPrice + waitingTimeDetails.totalWaitPrice + sundaySurcharge;
  const rideVat = (dayPrice + nightPrice + sundaySurcharge) * (rideVatRate / 100);
  const waitingVat = waitingTimeDetails.totalWaitPrice * (waitingVatRate / 100);
  const totalVat = rideVat + waitingVat;
  const totalTTC = subTotalHT + totalVat;
  
  // Apply minimum trip fare if applicable
  const minimumTripFare = selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0);
  const finalTotalTTC = Math.max(totalTTC, minimumTripFare);
  
  // Calculate night hours
  const nightHours = (oneWayNightMinutes + returnNightMinutes) / 60;
  const dayHours = (oneWayTotalMinutes + returnTotalMinutes - oneWayNightMinutes - returnNightMinutes) / 60;
  
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
