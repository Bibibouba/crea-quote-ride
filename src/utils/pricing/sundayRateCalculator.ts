
/**
 * Calculates surcharge for Sunday or holiday trips
 */
export const calculateSundaySurcharge = (
  basePrice: number,
  isSundayRate: boolean,
  sundayRatePercentage: number
): number => {
  if (!isSundayRate || sundayRatePercentage <= 0) {
    return 0;
  }
  
  return basePrice * (sundayRatePercentage / 100);
};
