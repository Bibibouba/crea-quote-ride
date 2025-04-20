
export const formatPrice = (price?: number | string | null) => {
  if (price === undefined || price === null) return "0.0";
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice) || typeof numericPrice !== 'number') return "0.0";
  return numericPrice.toFixed(1);
};

export const formatDistance = (distance: number) => {
  return Math.round(distance * 10) / 10;
};

export const calculateTTC = (priceHT: number, vatRate: number = 10) => {
  return priceHT * (1 + vatRate / 100);
};
