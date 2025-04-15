
/**
 * Calculates night rate surcharge
 * 
 * @param basePrice The base price before surcharge
 * @param isNightRateEnabled Whether night rate is enabled
 * @param nightKm Kilometers traveled during night hours
 * @param totalKm Total kilometers traveled
 * @param nightRatePercentage The percentage increase for night hours
 * @returns The night surcharge amount
 */
export const calculateNightSurcharge = (
  basePrice: number,
  isNightRateEnabled: boolean,
  nightKm: number,
  totalKm: number,
  nightRatePercentage: number
): number => {
  if (!isNightRateEnabled || nightRatePercentage <= 0 || nightKm <= 0 || totalKm <= 0) {
    return 0;
  }

  // Calculate the base price for the night portion
  const nightPortion = nightKm / totalKm;
  const nightBasePrice = basePrice * nightPortion;
  
  // Calculate the surcharge as a percentage of the night portion base price
  const surcharge = nightBasePrice * (nightRatePercentage / 100);
  
  return surcharge;
};
