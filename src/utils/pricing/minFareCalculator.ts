
/**
 * Applies minimum fare rules to trip prices
 */
export const applyMinimumFare = (
  calculatedPrice: number,
  minimumTripFare: number
): number => {
  if (minimumTripFare <= 0 || calculatedPrice >= minimumTripFare) {
    return calculatedPrice;
  }
  
  return minimumTripFare;
};
