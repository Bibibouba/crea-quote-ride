
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfContext } from './types';

export const generatePricingTable = (context: PdfContext, startY: number) => {
  const { doc, quote } = context;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TARIFICATION', 105, startY, { align: 'center' });
  
  // Base price for one-way
  const oneWayPrice = quote.has_return_trip ? (quote.amount / 2) : quote.amount;
  const returnPrice = quote.has_return_trip ? oneWayPrice : 0;
  const waitingPrice = quote.waiting_time_price || 0;
  
  // VAT rates
  const vatRate = 10;
  const waitingVatRate = 20;
  
  // Calculate prices
  const oneWayPriceHT = oneWayPrice / (1 + vatRate/100);
  const oneWayTVA = oneWayPrice - oneWayPriceHT;
  
  // Create pricing data array
  const pricingData = [
    ['Prestation', 'Montant HT', 'TVA', 'Montant TTC'],
    ['Trajet aller', `${oneWayPriceHT.toFixed(2)}€`, `${oneWayTVA.toFixed(2)}€ (${vatRate}%)`, `${oneWayPrice.toFixed(2)}€`]
  ];
  
  if (quote.has_return_trip) {
    const returnPriceHT = returnPrice / (1 + vatRate/100);
    const returnTVA = returnPrice - returnPriceHT;
    pricingData.push(['Trajet retour', `${returnPriceHT.toFixed(2)}€`, `${returnTVA.toFixed(2)}€ (${vatRate}%)`, `${returnPrice.toFixed(2)}€`]);
  }
  
  if (quote.has_waiting_time) {
    const waitingPriceHT = waitingPrice / (1 + waitingVatRate/100);
    const waitingTVA = waitingPrice - waitingPriceHT;
    pricingData.push([
      `Temps d'attente (${quote.waiting_time_minutes} min)`, 
      `${waitingPriceHT.toFixed(2)}€`, 
      `${waitingTVA.toFixed(2)}€ (${waitingVatRate}%)`, 
      `${waitingPrice.toFixed(2)}€`
    ]);
  }
  
  // Calculate totals
  const totalHT = oneWayPriceHT + 
    (quote.has_return_trip ? oneWayPriceHT : 0) + 
    (quote.has_waiting_time ? (waitingPrice / (1 + waitingVatRate/100)) : 0);
  const totalTVA = quote.amount - totalHT;
  
  // Add total row
  pricingData.push(['', '', '', '']);
  pricingData.push(['Total', `${totalHT.toFixed(2)}€`, `${totalTVA.toFixed(2)}€`, `${quote.amount.toFixed(2)}€`]);
  
  // Generate table
  autoTable(doc, {
    startY: startY + 5,
    head: [pricingData[0]],
    body: pricingData.slice(1),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 40, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
    },
    foot: [pricingData[pricingData.length-1]],
    footStyles: {
      fillColor: [240, 240, 240],
      fontStyle: 'bold',
    }
  });
};
