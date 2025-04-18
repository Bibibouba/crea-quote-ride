
/**
 * Calculates VAT amount based on price and rate
 */
export const calculateVAT = (price: number, vatRate: number, includeVAT: boolean): number => {
  if (includeVAT) {
    // Si le prix inclut déjà la TVA, calculer le prix HT
    return price / (1 + (vatRate / 100));
  } else {
    // Si le prix est HT, renvoyer le prix HT
    return price / (1 + (vatRate / 100));
  }
};
