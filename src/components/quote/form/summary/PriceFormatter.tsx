
import React from 'react';

interface PriceFormatterProps {
  price: number | string | null | undefined;
  showDecimals?: boolean;
  showVAT?: boolean;
  vatRate?: number;
  suffix?: string;
}

export const PriceFormatter = ({ 
  price, 
  showDecimals = true, 
  showVAT = false, 
  vatRate = 10,
  suffix = ''
}: PriceFormatterProps) => {
  if (price === undefined || price === null) {
    return <span>0{showDecimals ? '.0' : ''}€</span>;
  }
  
  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if it's a valid number
  if (isNaN(numericPrice) || typeof numericPrice !== 'number') {
    return <span>0{showDecimals ? '.0' : ''}€</span>;
  }
  
  // Handle suffix logic
  let displaySuffix = suffix;
  if (showVAT) {
    displaySuffix = ` ${displaySuffix} (TVA ${vatRate}%)`;
  }
  
  return <span>
    {showDecimals ? numericPrice.toFixed(1) : Math.round(numericPrice)}€
    {displaySuffix && ` ${displaySuffix}`}
  </span>;
};
