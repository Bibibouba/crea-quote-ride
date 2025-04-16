
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
  const nightPrice = nightKm * basePrice;
  
  // Import the already existing nightSurcharge calculator
  const nightSurcharge = isNightRateEnabled && nightKm > 0 
    ? (nightPrice * (nightRatePercentage / 100))
    : 0;
  
  return {
    isNightRate: isNightRateEnabled && nightKm > 0,
    nightRatePercentage,
    dayPrice,
    nightPrice,
    nightSurcharge,
    totalWithNightRate: dayPrice + nightPrice + nightSurcharge
  };
};
