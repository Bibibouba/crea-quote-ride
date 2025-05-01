
import { PdfContext } from '../types';

export interface PricingRow {
  description: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
}

export interface PricingTableData {
  rows: PricingRow[];
  totals: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
  };
}
