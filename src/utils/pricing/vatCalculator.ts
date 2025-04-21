
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
  const oneWayVAT = oneWayPriceHT * (rideVatRate / 100);
  const returnVAT = returnPriceHT * (rideVatRate / 100);
  const waitingTimeVAT = waitingTimePriceHT * (waitingVatRate / 100);
  
  const oneWayPrice = oneWayPriceHT + oneWayVAT;
  const returnPrice = returnPriceHT + returnVAT;
  const waitingTimePrice = waitingTimePriceHT + waitingTimeVAT;
  
  // Sum up all pre-tax prices
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  
  // Sum up all VAT amounts
  const totalVAT = oneWayVAT + returnVAT + waitingTimeVAT;
  
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
