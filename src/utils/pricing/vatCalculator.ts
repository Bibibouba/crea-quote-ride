
/**
 * Calculates VAT and final prices
 */
export const calculateVatAndTotalPrices = (
  oneWayPriceHT: number,
  returnPriceHT: number,
  waitingTimePriceHT: number,
  rideVatRate: number = 10,
  waitingVatRate: number = 20
): {
  oneWayPrice: number;
  returnPrice: number;
  waitingTimePrice: number;
  totalPriceHT: number;
  totalVAT: number;
  totalPrice: number;
} => {
  // Calculate prices with VAT for each component
  const oneWayPrice = oneWayPriceHT * (1 + (rideVatRate / 100));
  const returnPrice = returnPriceHT * (1 + (rideVatRate / 100));
  const waitingTimePrice = waitingTimePriceHT * (1 + (waitingVatRate / 100));
  
  // Sum up all pre-tax prices
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  
  // Calculate VAT amounts
  const rideVAT = (oneWayPriceHT + returnPriceHT) * (rideVatRate / 100);
  const waitingVAT = waitingTimePriceHT * (waitingVatRate / 100);
  const totalVAT = rideVAT + waitingVAT;
  
  // Calculate final price with all taxes
  const totalPrice = totalPriceHT + totalVAT;
  
  return {
    oneWayPrice,
    returnPrice,
    waitingTimePrice,
    totalPriceHT,
    totalVAT,
    totalPrice
  };
};
