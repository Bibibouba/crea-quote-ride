
import { PdfContext } from './types';
import { preparePricingData } from './pricing/table-data';
import { generatePricingTable as renderPricingTable } from './pricing/table-generator';

export const generatePricingTable = (context: PdfContext, startY: number): void => {
  const { doc } = context;
  
  // Add pricing section title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TARIFICATION', 105, startY, { align: 'center' });
  
  // Generate pricing table data
  const pricingData = preparePricingData(context);
  
  // Generate the table
  renderPricingTable(doc, pricingData, startY + 10);
};
