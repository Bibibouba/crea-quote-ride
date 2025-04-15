
import React from 'react';

interface PriceFormatterProps {
  price: number | string | null | undefined;
}

export const PriceFormatter = ({ price }: PriceFormatterProps) => {
  if (price === undefined || price === null) {
    return <span>0.0€</span>;
  }
  
  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number
  if (isNaN(numericPrice) || typeof numericPrice !== 'number') {
    return <span>0.0€</span>;
  }
  
  return <span>{numericPrice.toFixed(1)}€</span>;
};
