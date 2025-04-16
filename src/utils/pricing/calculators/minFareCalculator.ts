
import { applyMinimumFare } from '../minFareCalculator';

/**
 * Calculates the final price after applying minimum fare rules
 */
export const calculateMinFare = (
  calculatedPrice: number,
  minimumFare: number
) => {
  return {
    finalPrice: applyMinimumFare(calculatedPrice, minimumFare)
  };
};
