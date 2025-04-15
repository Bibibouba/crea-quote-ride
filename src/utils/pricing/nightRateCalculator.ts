
import { PricingSettings } from '@/types/quoteForm';

/**
 * Calculates night surcharge portion of a trip
 */
export const calculateNightSurcharge = (
  oneWayNightProportion: number,
  returnNightProportion: number,
  adjustedDistance: number,
  adjustedReturnDistance: number,
  basePrice: number, 
  nightRatePercentage: number,
  hasReturnTrip: boolean
): {
  nightSurcharge: number;
  oneWayNightPriceHT: number;
  oneWayDayPriceHT: number;
  returnNightPriceHT: number;
  returnDayPriceHT: number;
  dayKm: number;
  nightKm: number;
  totalKm: number;
  dayPrice: number;
  nightPrice: number;
} => {
  // Calculate day and night kilometers for one-way trip
  const dayKm = Math.round((1 - oneWayNightProportion) * adjustedDistance);
  const nightKm = Math.round(oneWayNightProportion * adjustedDistance);
  const totalKm = adjustedDistance;
  
  // Calculate base prices for day and night portions
  const dayPrice = dayKm * basePrice;
  const nightPriceBase = nightKm * basePrice;
  const nightPriceWithSurcharge = nightPriceBase * (1 + nightRatePercentage / 100);
  const nightPrice = nightPriceWithSurcharge;
  
  // Calculate night surcharge (the difference between night price with and without surcharge)
  const nightSurcharge = nightPriceWithSurcharge - nightPriceBase;
  
  // Calculate one-way price components
  const oneWayNightPriceHT = oneWayNightProportion > 0 ? nightPrice : 0;
  const oneWayDayPriceHT = dayPrice;
  
  // Calculate return price components if applicable
  const returnNightPriceHT = hasReturnTrip ? 
    (adjustedReturnDistance * basePrice * returnNightProportion) : 0;
  const returnDayPriceHT = hasReturnTrip ? 
    (adjustedReturnDistance * basePrice - returnNightPriceHT) : 0;
  
  return {
    nightSurcharge,
    oneWayNightPriceHT,
    oneWayDayPriceHT,
    returnNightPriceHT,
    returnDayPriceHT,
    dayKm,
    nightKm,
    totalKm,
    dayPrice,
    nightPrice
  };
};
