
/**
 * Calculates VAT and final prices
 */
export const calculateVatAndTotalPrices = (
  oneWayPriceHT: number,
  returnPriceHT: number,
  waitingTimePriceHT: number,
  rideVatRate: number,
  waitingVatRate: number
): {
  oneWayPrice: number;
  returnPrice: number;
  waitingTimePrice: number;
  totalPriceHT: number;
  totalVAT: number;
  totalPrice: number;
} => {
  const oneWayPrice = oneWayPriceHT * (1 + (rideVatRate / 100));
  const returnPrice = returnPriceHT * (1 + (rideVatRate / 100));
  const waitingTimePrice = waitingTimePriceHT * (1 + (waitingVatRate / 100));
  
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  
  const rideVAT = (oneWayPriceHT + returnPriceHT) * (rideVatRate / 100);
  const waitingVAT = waitingTimePriceHT * (waitingVatRate / 100);
  const totalVAT = rideVAT + waitingVAT;
  
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
