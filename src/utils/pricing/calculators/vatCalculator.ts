
/**
 * Calculates VAT amount based on price and rate
 */
export const calculateVAT = (price: number, vatRate: number, includeVAT: boolean): number => {
  if (includeVAT) {
    // Si le prix inclut déjà la TVA, calculer le montant de TVA
    return price - (price / (1 + (vatRate / 100)));
  } else {
    // Si le prix est HT, calculer le montant de TVA
    return price * (vatRate / 100);
  }
};
