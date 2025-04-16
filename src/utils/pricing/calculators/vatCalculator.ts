
/**
 * Calculates VAT amount based on price and rate
 */
export const calculateVAT = (price: number, vatRate: number, includeVAT: boolean): number => {
  if (includeVAT) {
    return price / (1 + (vatRate / 100));
  } else {
    return price / (1 + (vatRate / 100));
  }
};
