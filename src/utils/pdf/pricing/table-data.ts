
import { PdfContext } from '../types';
import { PricingTableData } from './types';

export const preparePricingData = (context: PdfContext): PricingTableData => {
  const { quote } = context;
  
  // Base price for one-way
  const oneWayPrice = quote.has_return_trip ? (quote.amount / 2) : quote.amount;
  const returnPrice = quote.has_return_trip ? oneWayPrice : 0;
  const waitingPrice = quote.waiting_time_price || 0;
  
  // VAT rates
  const rideVatRate = 10;
  const waitingVatRate = 20;
  
  // Calculate prices
  const oneWayPriceHT = oneWayPrice / (1 + rideVatRate/100);
  
  const rows = [
    {
      description: 'Trajet aller',
      priceHT: oneWayPriceHT,
      tvaRate: rideVatRate,
      priceTTC: oneWayPrice
    }
  ];
  
  if (quote.has_return_trip) {
    const returnPriceHT = returnPrice / (1 + rideVatRate/100);
    rows.push({
      description: 'Trajet retour',
      priceHT: returnPriceHT,
      tvaRate: rideVatRate,
      priceTTC: returnPrice
    });
  }
  
  if (quote.has_waiting_time) {
    const waitingPriceHT = waitingPrice / (1 + waitingVatRate/100);
    rows.push({
      description: `Temps d'attente (${quote.waiting_time_minutes} min)`,
      priceHT: waitingPriceHT,
      tvaRate: waitingVatRate,
      priceTTC: waitingPrice
    });
  }
  
  // Calculate totals
  const totalHT = rows.reduce((sum, row) => sum + row.priceHT, 0);
  const totalTTC = rows.reduce((sum, row) => sum + row.priceTTC, 0);
  const totalTVA = totalTTC - totalHT;
  
  return {
    rows,
    totals: {
      totalHT,
      totalTVA,
      totalTTC
    }
  };
};
