import { PricingSettings, QuoteDetails } from '@/types/quoteForm';

export const calculateWaitingTimePrice = (
  hasWaitingTime: boolean, 
  waitingTimeMinutes: number, 
  pricingSettings: PricingSettings | null,
  time: string,
  selectedVehicle: any = null
): number => {
  if (!hasWaitingTime) return 0;
  
  const pricePerQuarter = selectedVehicle?.wait_price_per_15min || 
                        pricingSettings?.wait_price_per_15min || 7.5;
  
  const quarters = Math.ceil(waitingTimeMinutes / 15);
  let price = quarters * pricePerQuarter;
  
  const useVehicleWaitNight = selectedVehicle?.wait_night_enabled && 
                             selectedVehicle?.wait_night_start && 
                             selectedVehicle?.wait_night_end && 
                             selectedVehicle?.wait_night_percentage;
  
  if ((useVehicleWaitNight || (pricingSettings?.wait_night_enabled && pricingSettings?.wait_night_percentage)) && time) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date();
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date();
    const startTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_start : pricingSettings?.wait_night_start;
    const [startHours, startMinutes] = startTimeStr?.split(':').map(Number) || [0, 0];
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date();
    const endTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_end : pricingSettings?.wait_night_end;
    const [endHours, endMinutes] = endTimeStr?.split(':').map(Number) || [0, 0];
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    const isNight = (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
    
    if (isNight) {
      const nightPercentage = useVehicleWaitNight ? 
                            selectedVehicle.wait_night_percentage : 
                            pricingSettings?.wait_night_percentage || 0;
      price += price * (nightPercentage / 100);
    }
  }
  
  return Math.round(price);
};

export const isNightTime = (
  date: Date,
  time: string,
  vehicleSettings: any,
  settings: PricingSettings | null
): boolean => {
  if (vehicleSettings && vehicleSettings.night_rate_enabled && 
      vehicleSettings.night_rate_start && vehicleSettings.night_rate_end) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date(date);
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date(date);
    const [startHours, startMinutes] = vehicleSettings.night_rate_start.split(':').map(Number);
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date(date);
    const [endHours, endMinutes] = vehicleSettings.night_rate_end.split(':').map(Number);
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    return (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
  }
  
  if (!settings || !settings.night_rate_enabled || !settings.night_rate_start || !settings.night_rate_end) {
    return false;
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  const tripTime = new Date(date);
  tripTime.setHours(hours);
  tripTime.setMinutes(minutes);
  
  const startTime = new Date(date);
  const [startHours, startMinutes] = settings.night_rate_start.split(':').map(Number);
  startTime.setHours(startHours);
  startTime.setMinutes(startMinutes);
  
  const endTime = new Date(date);
  const [endHours, endMinutes] = settings.night_rate_end.split(':').map(Number);
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);
  
  return (
    (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
    (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
  );
};

export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

export const calculateNightDuration = (
  startDate: Date,
  startTime: string,
  durationMinutes: number,
  vehicleSettings: any,
  globalSettings: PricingSettings | null
): { nightMinutes: number, totalMinutes: number } => {
  if ((!vehicleSettings?.night_rate_enabled && !globalSettings?.night_rate_enabled) || durationMinutes <= 0) {
    return { nightMinutes: 0, totalMinutes: durationMinutes };
  }
  
  const nightStart = vehicleSettings?.night_rate_enabled ? 
    vehicleSettings.night_rate_start : 
    globalSettings?.night_rate_start;
  
  const nightEnd = vehicleSettings?.night_rate_enabled ? 
    vehicleSettings.night_rate_end : 
    globalSettings?.night_rate_end;
  
  if (!nightStart || !nightEnd) {
    return { nightMinutes: 0, totalMinutes: durationMinutes };
  }
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const departureMinutes = startHours * 60 + startMinutes;
  
  const [nightStartHours, nightStartMins] = nightStart.split(':').map(Number);
  const nightStartMinutes = nightStartHours * 60 + nightStartMins;
  
  const [nightEndHours, nightEndMins] = nightEnd.split(':').map(Number);
  const nightEndMinutes = nightEndHours * 60 + nightEndMins;
  
  const arrivalMinutes = (departureMinutes + durationMinutes) % 1440;
  
  if (nightStartMinutes > nightEndMinutes) {
    if (departureMinutes >= nightStartMinutes) {
      if (arrivalMinutes <= nightEndMinutes) {
        return { nightMinutes: durationMinutes, totalMinutes: durationMinutes };
      }
      else {
        const nightPortionMinutes = (1440 - departureMinutes) + nightEndMinutes;
        return { 
          nightMinutes: Math.min(nightPortionMinutes, durationMinutes), 
          totalMinutes: durationMinutes 
        };
      }
    }
    else if (departureMinutes < nightEndMinutes) {
      if (arrivalMinutes <= nightEndMinutes) {
        return { nightMinutes: durationMinutes, totalMinutes: durationMinutes };
      }
      else {
        return { 
          nightMinutes: nightEndMinutes - departureMinutes, 
          totalMinutes: durationMinutes 
        };
      }
    }
    else {
      if (arrivalMinutes < nightStartMinutes) {
        return { nightMinutes: 0, totalMinutes: durationMinutes };
      }
      else {
        return { 
          nightMinutes: arrivalMinutes - nightStartMinutes, 
          totalMinutes: durationMinutes 
        };
      }
    }
  }
  else {
    const courseStart = departureMinutes;
    const courseEnd = departureMinutes + durationMinutes;
    
    if (courseEnd <= nightStartMinutes || courseStart >= nightEndMinutes) {
      return { nightMinutes: 0, totalMinutes: durationMinutes };
    }
    
    if (courseStart >= nightStartMinutes && courseEnd <= nightEndMinutes) {
      return { nightMinutes: durationMinutes, totalMinutes: durationMinutes };
    }
    
    if (courseStart < nightStartMinutes && courseEnd <= nightEndMinutes) {
      return { 
        nightMinutes: courseEnd - nightStartMinutes, 
        totalMinutes: durationMinutes 
      };
    }
    
    if (courseStart >= nightStartMinutes && courseEnd > nightEndMinutes) {
      return { 
        nightMinutes: nightEndMinutes - courseStart, 
        totalMinutes: durationMinutes 
      };
    }
    
    return { 
      nightMinutes: nightEndMinutes - nightStartMinutes, 
      totalMinutes: durationMinutes 
    };
  }
};

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
  
  const oneWayDuration = estimatedDistance > 0 ? Math.max(10, estimatedDistance * 2) : 0;
  const { nightMinutes: oneWayNightMinutes, totalMinutes: oneWayTotalMinutes } = 
    calculateNightDuration(date, rideTime, oneWayDuration, selectedVehicleInfo, pricingSettings);
  
  let returnNightMinutes = 0;
  let returnTotalMinutes = 0;
  
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
  }
  
  const oneWayNightProportion = oneWayTotalMinutes > 0 ? oneWayNightMinutes / oneWayTotalMinutes : 0;
  const returnNightProportion = returnTotalMinutes > 0 ? returnNightMinutes / returnTotalMinutes : 0;
  
  let oneWayPriceHT = adjustedDistance * basePrice;
  let returnPriceHT = hasReturnTrip ? (returnToSameAddress ? adjustedDistance * basePrice : adjustedReturnDistance * basePrice) : 0;
  
  const oneWayNightPriceHT = oneWayPriceHT * oneWayNightProportion;
  const oneWayDayPriceHT = oneWayPriceHT - oneWayNightPriceHT;
  
  const returnNightPriceHT = returnPriceHT * returnNightProportion;
  const returnDayPriceHT = returnPriceHT - returnNightPriceHT;
  
  let nightSurcharge = 0;
  if (nightRatePercentage > 0) {
    const nightSurchargeAmount = (oneWayNightPriceHT + returnNightPriceHT) * (nightRatePercentage / 100);
    nightSurcharge = nightSurchargeAmount;
    
    oneWayPriceHT = oneWayDayPriceHT + oneWayNightPriceHT * (1 + nightRatePercentage / 100);
    returnPriceHT = returnDayPriceHT + returnNightPriceHT * (1 + nightRatePercentage / 100);
  }
  
  let sundaySurcharge = 0;
  if (isSundayRate && holidaySundayPercentage > 0) {
    const sundayPercentage = holidaySundayPercentage / 100;
    sundaySurcharge = (oneWayPriceHT + returnPriceHT) * sundayPercentage;
    oneWayPriceHT += oneWayPriceHT * sundayPercentage;
    returnPriceHT += returnPriceHT * sundayPercentage;
  }
  
  const minimumTripFare = selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0);
  if (minimumTripFare > 0 && (oneWayPriceHT + returnPriceHT) < minimumTripFare) {
    const ratio = oneWayPriceHT / (oneWayPriceHT + returnPriceHT || 1);
    oneWayPriceHT = minimumTripFare * ratio;
    returnPriceHT = minimumTripFare * (1 - ratio);
  }
  
  const waitingTimePriceHT = hasWaitingTime ? waitingTimePrice : 0;
  
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
  
  const nightStartDisplay = selectedVehicleInfo.night_rate_enabled ? 
    selectedVehicleInfo.night_rate_start : 
    pricingSettings?.night_rate_start || '';
  
  const nightEndDisplay = selectedVehicleInfo.night_rate_enabled ? 
    selectedVehicleInfo.night_rate_end : 
    pricingSettings?.night_rate_end || '';
  
  return {
    basePrice,
    isNightRate,
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
    nightStartDisplay,
    nightEndDisplay
  };
};
