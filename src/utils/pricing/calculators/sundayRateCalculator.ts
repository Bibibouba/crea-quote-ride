
import { calculateSundaySurcharge } from '../sundayRateCalculator';

/**
 * Calculates Sunday/holiday rate pricing details
 */
export const calculateSundayRate = (
  basePrice: number,
  isSunday: boolean,
  sundayRatePercentage: number
) => {
  const sundaySurcharge = calculateSundaySurcharge(
    basePrice,
    isSunday,
    sundayRatePercentage
  );
  
  return {
    sundaySurcharge,
    totalWithSunday: basePrice + sundaySurcharge
  };
};
