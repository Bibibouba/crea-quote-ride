
/**
 * Applies minimum fare rules to trip prices
 */
export const applyMinimumFare = (
  oneWayPriceHT: number,
  returnPriceHT: number,
  minimumTripFare: number
): {
  updatedOneWayPriceHT: number;
  updatedReturnPriceHT: number;
} => {
  if (minimumTripFare <= 0 || (oneWayPriceHT + returnPriceHT) >= minimumTripFare) {
    return {
      updatedOneWayPriceHT: oneWayPriceHT,
      updatedReturnPriceHT: returnPriceHT
    };
  }
  
  const ratio = oneWayPriceHT / (oneWayPriceHT + returnPriceHT || 1);
  
  return {
    updatedOneWayPriceHT: minimumTripFare * ratio,
    updatedReturnPriceHT: minimumTripFare * (1 - ratio)
  };
};
