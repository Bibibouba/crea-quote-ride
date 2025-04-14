
import { PricingSettings, QuoteDetails } from '@/types/quoteForm';

export const calculateWaitingTimePrice = (
  hasWaitingTime: boolean, 
  waitingTimeMinutes: number, 
  pricingSettings: PricingSettings | null,
  time: string
): number => {
  if (!hasWaitingTime || !pricingSettings) return 0;
  
  const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
  
  const quarters = Math.ceil(waitingTimeMinutes / 15);
  let price = quarters * pricePerQuarter;
  
  if (pricingSettings.wait_night_enabled && pricingSettings.wait_night_percentage && time) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date();
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date();
    const [startHours, startMinutes] = pricingSettings.wait_night_start?.split(':').map(Number) || [0, 0];
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date();
    const [endHours, endMinutes] = pricingSettings.wait_night_end?.split(':').map(Number) || [0, 0];
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    const isNight = (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
    
    if (isNight) {
      const nightPercentage = pricingSettings.wait_night_percentage || 0;
      price += price * (nightPercentage / 100);
    }
  }
  
  return Math.round(price);
};

export const isNightTime = (date: Date, time: string, settings: PricingSettings | null): boolean => {
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
  
  const isNightRate = isNightTime(date, time, pricingSettings);
  const isSundayRate = isSunday(date);
  
  let oneWayPriceHT = estimatedDistance * basePrice;
  let returnPriceHT = hasReturnTrip ? (returnToSameAddress ? estimatedDistance * basePrice : returnDistance * basePrice) : 0;
  
  let nightSurcharge = 0;
  let sundaySurcharge = 0;
  
  if (isNightRate && pricingSettings && pricingSettings.night_rate_percentage) {
    const nightPercentage = pricingSettings.night_rate_percentage / 100;
    nightSurcharge = (oneWayPriceHT + returnPriceHT) * nightPercentage;
    oneWayPriceHT += oneWayPriceHT * nightPercentage;
    returnPriceHT += returnPriceHT * nightPercentage;
  }
  
  if (isSundayRate && pricingSettings && pricingSettings.holiday_sunday_percentage) {
    const sundayPercentage = pricingSettings.holiday_sunday_percentage / 100;
    sundaySurcharge = (oneWayPriceHT + returnPriceHT) * sundayPercentage;
    oneWayPriceHT += oneWayPriceHT * sundayPercentage;
    returnPriceHT += returnPriceHT * sundayPercentage;
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
    waitingVatRate
  };
};
