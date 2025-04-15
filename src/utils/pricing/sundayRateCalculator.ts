
/**
 * Calculates surcharge for Sunday or holiday trips
 */
export const calculateSundaySurcharge = (
  isSundayRate: boolean,
  holidaySundayPercentage: number,
  oneWayPriceHT: number,
  returnPriceHT: number
): {
  sundaySurcharge: number;
  updatedOneWayPriceHT: number;
  updatedReturnPriceHT: number;
} => {
  if (!isSundayRate || holidaySundayPercentage <= 0) {
    return {
      sundaySurcharge: 0,
      updatedOneWayPriceHT: oneWayPriceHT,
      updatedReturnPriceHT: returnPriceHT
    };
  }
  
  const sundayPercentage = holidaySundayPercentage / 100;
  const sundaySurcharge = (oneWayPriceHT + returnPriceHT) * sundayPercentage;
  
  return {
    sundaySurcharge,
    updatedOneWayPriceHT: oneWayPriceHT + (oneWayPriceHT * sundayPercentage),
    updatedReturnPriceHT: returnPriceHT + (returnPriceHT * sundayPercentage)
  };
};
