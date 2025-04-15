import { PricingSettings, QuoteDetails } from '@/types/quoteForm';
import { isNightTime, isSunday, calculateNightDuration, calculateDayNightKmSplit } from './timeUtils';
import { calculateNightSurcharge } from './nightRateCalculator';
import { calculateSundaySurcharge } from './sundayRateCalculator';
import { applyMinimumFare } from './minFareCalculator';
import { calculateVatAndTotalPrices } from './vatCalculator';

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
  
  // Calculate night proportions
  const oneWayNightProportion = oneWayTotalMinutes > 0 ? oneWayNightMinutes / oneWayTotalMinutes : 0;
  const returnNightProportion = returnTotalMinutes > 0 ? returnNightMinutes / returnTotalMinutes : 0;
  
  // Calculate night surcharge and price components
  const nightSurchargeResult = calculateNightSurcharge(
    oneWayNightProportion,
    returnNightProportion,
    adjustedDistance,
    adjustedReturnDistance,
    basePrice,
    nightRatePercentage,
    hasReturnTrip
  );
  
  let oneWayPriceHT = nightSurchargeResult.oneWayDayPriceHT + nightSurchargeResult.oneWayNightPriceHT;
  // Apply night surcharge to one-way price
  if (nightSurchargeResult.oneWayNightPriceHT > 0) {
    oneWayPriceHT += (nightSurchargeResult.oneWayNightPriceHT * (nightRatePercentage / 100));
  }
  
  let returnPriceHT = 0;
  if (hasReturnTrip) {
    returnPriceHT = nightSurchargeResult.returnDayPriceHT;
    // Apply night surcharge to return price
    if (nightSurchargeResult.returnNightPriceHT > 0) {
      returnPriceHT += nightSurchargeResult.returnNightPriceHT;
      returnPriceHT += (nightSurchargeResult.returnNightPriceHT * (nightRatePercentage / 100));
    }
  }
  
  // Apply Sunday/holiday surcharge if applicable
  const sundaySurchargeResult = calculateSundaySurcharge(
    isSundayRate,
    holidaySundayPercentage,
    oneWayPriceHT,
    returnPriceHT
  );
  
  oneWayPriceHT = sundaySurchargeResult.updatedOneWayPriceHT;
  returnPriceHT = sundaySurchargeResult.updatedReturnPriceHT;
  
  // Apply minimum trip fare if applicable
  const minimumTripFare = selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0);
  const minFareResult = applyMinimumFare(oneWayPriceHT, returnPriceHT, minimumTripFare);
  
  oneWayPriceHT = minFareResult.updatedOneWayPriceHT;
  returnPriceHT = minFareResult.updatedReturnPriceHT;
  
  const waitingTimePriceHT = hasWaitingTime ? waitingTimePrice : 0;
  
  // Calculate VAT and final prices
  const rideVatRate = pricingSettings?.ride_vat_rate !== undefined ? pricingSettings.ride_vat_rate : 10;
  const waitingVatRate = pricingSettings?.waiting_vat_rate !== undefined ? pricingSettings.waiting_vat_rate : 20;
  
  const priceResult = calculateVatAndTotalPrices(
    oneWayPriceHT,
    returnPriceHT,
    waitingTimePriceHT,
    rideVatRate,
    waitingVatRate
  );
  
  // Calculate night and day hours
  const nightHours = (oneWayNightMinutes + returnNightMinutes) / 60;
  const dayHours = (oneWayTotalMinutes + returnTotalMinutes - oneWayNightMinutes - returnNightMinutes) / 60;
  
  // Create combined night start/end display
  const combinedNightStartDisplay = nightStartDisplay + (returnNightStartDisplay ? ` / ${returnNightStartDisplay}` : '');
  const combinedNightEndDisplay = nightEndDisplay + (returnNightEndDisplay ? ` / ${returnNightEndDisplay}` : '');
  
  return {
    basePrice,
    isNightRate: oneWayNightMinutes > 0 || returnNightMinutes > 0,
    isSunday: isSundayRate,
    oneWayPriceHT,
    oneWayPrice: priceResult.oneWayPrice,
    returnPriceHT,
    returnPrice: priceResult.returnPrice,
    waitingTimePriceHT,
    waitingTimePrice: priceResult.waitingTimePrice,
    totalPriceHT: priceResult.totalPriceHT,
    totalVAT: priceResult.totalVAT,
    totalPrice: priceResult.totalPrice,
    nightSurcharge: nightSurchargeResult.nightSurcharge,
    sundaySurcharge: sundaySurchargeResult.sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning,
    minDistance,
    nightMinutes: oneWayNightMinutes + returnNightMinutes,
    totalMinutes: oneWayTotalMinutes + returnTotalMinutes,
    nightRatePercentage,
    nightHours,
    dayHours,
    nightStartDisplay: combinedNightStartDisplay,
    nightEndDisplay: combinedNightEndDisplay,
    dayKm: nightSurchargeResult.dayKm,
    nightKm: nightSurchargeResult.nightKm, 
    totalKm: nightSurchargeResult.totalKm,
    dayPrice: nightSurchargeResult.dayPrice,
    nightPrice: nightSurchargeResult.nightPrice,
    sundayRate: holidaySundayPercentage,
    waitTimeDay: 0,
    waitTimeNight: 0,
    waitPriceDay: 0,
    waitPriceNight: 0
  };
};
