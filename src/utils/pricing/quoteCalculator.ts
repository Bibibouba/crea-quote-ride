
import { 
  calculateNightSurcharge,
  isNightTime, 
  calculateNightDuration,
  calculateDayNightKmSplit
} from './index';
import { calculateSundaySurcharge } from './sundayRateCalculator';
import { applyMinimumFare } from './minFareCalculator';
import { calculateVatAndTotalPrices } from './vatCalculator';

export const calculateQuoteDetails = (
  vehicleId,
  distance,
  returnDistance,
  hasReturnTrip,
  returnToSameAddress,
  vehicles,
  hasWaitingTime,
  waitingTimePrice,
  time,
  date,
  pricingSettings
) => {
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  if (!selectedVehicle) return null;
  
  const basePrice = selectedVehicle.basePrice || 1.8;
  const nightRateEnabled = selectedVehicle.night_rate_enabled || false;
  const nightRateStart = selectedVehicle.night_rate_start || '20:00';
  const nightRateEnd = selectedVehicle.night_rate_end || '06:00';
  const nightRatePercentage = selectedVehicle.night_rate_percentage || 0;
  const minDistance = selectedVehicle.min_trip_distance || 0;
  const minimumFare = selectedVehicle.minimum_trip_fare || 0;
  const isSundayOrHoliday = date.getDay() === 0; // Only checking Sunday for now
  const sundayRatePercentage = selectedVehicle.holiday_sunday_percentage || 0;
  
  // Time formatting for display
  const nightStartDisplay = nightRateStart;
  const nightEndDisplay = nightRateEnd;
  
  // Check if minimum distance requirement is met
  const hasMinDistanceWarning = minDistance > 0 && distance < minDistance;
  const calculatedDistanceOneWay = hasMinDistanceWarning ? minDistance : distance;
  
  // Calculate one-way trip price before any surcharges
  let oneWayPriceBase = calculatedDistanceOneWay * basePrice;
  oneWayPriceBase = applyMinimumFare(oneWayPriceBase, minimumFare);
  
  // Calculate night surcharge for one-way trip
  const [timeHours, timeMinutes] = time.split(':').map(Number);
  const tripDateTime = new Date(date);
  tripDateTime.setHours(timeHours, timeMinutes);
  
  // Calculate estimated duration in minutes
  const averageSpeedKmPerHour = 50; // Assumption: average speed of 50 km/h
  const estimatedDurationHours = distance / averageSpeedKmPerHour;
  const estimatedDurationMinutes = estimatedDurationHours * 60;
  
  // Calculate trip end time
  const tripEndTime = new Date(tripDateTime);
  tripEndTime.setMinutes(tripEndTime.getMinutes() + estimatedDurationMinutes);
  
  // Calculate night duration as a fraction of total trip duration
  const nightDurationDetails = calculateNightDuration(
    tripDateTime,
    tripEndTime,
    nightRateStart,
    nightRateEnd
  );
  
  const nightMinutes = nightDurationDetails.nightMinutes;
  const totalMinutes = estimatedDurationMinutes;
  const nightHoursDecimal = nightMinutes / 60;
  const dayHoursDecimal = (totalMinutes - nightMinutes) / 60;
  
  // Calculate day and night kilometer split
  const kmSplit = calculateDayNightKmSplit(
    tripDateTime,
    tripEndTime,
    calculatedDistanceOneWay,
    nightRateStart,
    nightRateEnd
  );
  
  // Calculer les prix spécifiques pour les parties jour et nuit
  const dayPrice = kmSplit.dayKm * basePrice;
  const nightPrice = kmSplit.nightKm * basePrice * (1 + nightRatePercentage / 100);
  
  const nightSurcharge = calculateNightSurcharge(
    oneWayPriceBase,
    nightRateEnabled,
    kmSplit.nightKm,
    kmSplit.totalKm,
    nightRatePercentage
  );
  
  // Calculate Sunday surcharge
  const sundaySurcharge = calculateSundaySurcharge(
    oneWayPriceBase + nightSurcharge,
    isSundayOrHoliday,
    sundayRatePercentage
  );
  
  // Apply night and Sunday surcharges
  let oneWayPriceHT = oneWayPriceBase + nightSurcharge + sundaySurcharge;
  
  // Calculate return trip price if applicable
  let returnPriceHT = 0;
  let returnBasePrice = 0;
  let returnNightSurcharge = 0;
  let returnSundaySurcharge = 0;
  
  if (hasReturnTrip) {
    const returnCalculatedDistance = returnToSameAddress
      ? calculatedDistanceOneWay
      : (hasMinDistanceWarning && returnDistance < minDistance) ? minDistance : returnDistance;
    
    returnBasePrice = returnCalculatedDistance * basePrice;
    returnBasePrice = applyMinimumFare(returnBasePrice, minimumFare);
    
    // For simplicity, assume return trip has same night/day distribution
    // A more accurate calculation would consider the return trip's specific time
    returnNightSurcharge = calculateNightSurcharge(
      returnBasePrice,
      nightRateEnabled,
      kmSplit.nightKm,
      kmSplit.totalKm,
      nightRatePercentage
    );
    
    returnSundaySurcharge = calculateSundaySurcharge(
      returnBasePrice + returnNightSurcharge,
      isSundayOrHoliday,
      sundayRatePercentage
    );
    
    returnPriceHT = returnBasePrice + returnNightSurcharge + returnSundaySurcharge;
  }
  
  // Calculate waiting time price
  const waitingTimePriceHT = hasWaitingTime ? waitingTimePrice : 0;
  
  // Calculate total price HT
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  
  // Calculate VAT and total price TTC
  const rideVatRate = pricingSettings?.ride_vat_rate || 10;
  const waitingVatRate = pricingSettings?.waiting_vat_rate || 20;
  
  const { totalPrice, totalVAT } = calculateVatAndTotalPrices(
    oneWayPriceHT,
    returnPriceHT,
    waitingTimePriceHT,
    rideVatRate,
    waitingVatRate
  );
  
  return {
    basePrice,
    isNightRate: nightRateEnabled && nightMinutes > 0,
    nightRatePercentage,
    nightHours: nightHoursDecimal,
    dayHours: dayHoursDecimal,
    nightMinutes,
    totalMinutes,
    nightStartDisplay,
    nightEndDisplay,
    dayKm: kmSplit.dayKm,
    nightKm: kmSplit.nightKm,
    totalKm: kmSplit.totalKm,
    dayPercentage: kmSplit.dayPercentage,
    nightPercentage: kmSplit.nightPercentage,
    dayPrice: dayPrice,
    nightPrice: nightPrice,
    isSunday: isSundayOrHoliday,
    sundayRate: sundayRatePercentage,
    oneWayPriceHT,
    returnPriceHT,
    waitingTimePriceHT,
    totalPriceHT,
    totalVAT,
    oneWayPrice: oneWayPriceHT * (1 + rideVatRate / 100),
    returnPrice: returnPriceHT * (1 + rideVatRate / 100),
    waitingTimePrice: waitingTimePriceHT * (1 + waitingVatRate / 100),
    totalPrice,
    nightSurcharge,
    sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning,
    minDistance,
    waitTimeDay: 0, // These would need more complex calculation
    waitTimeNight: 0,
    waitPriceDay: 0,
    waitPriceNight: 0
  };
};
