
/**
 * Calculates night rate pricing details for a trip
 */
export const calculateNightRate = (
  basePrice: number,
  dayKm: number,
  nightKm: number,
  isNightRateEnabled: boolean,
  nightRatePercentage: number
) => {
  const dayPrice = dayKm * basePrice;
  
  // Calculate night price: first the base price, then add the percentage
  const nightBasePrice = nightKm * basePrice;
  const nightPrice = nightBasePrice * (1 + nightRatePercentage / 100);
  
  // Calculate night surcharge separately for reporting
  const nightSurcharge = isNightRateEnabled && nightKm > 0 
    ? nightBasePrice * (nightRatePercentage / 100)
    : 0;
  
  return {
    isNightRate: isNightRateEnabled && nightKm > 0,
    nightRatePercentage,
    dayPrice,
    nightPrice,
    nightSurcharge,
    totalWithNightRate: dayPrice + nightPrice
  };
};
