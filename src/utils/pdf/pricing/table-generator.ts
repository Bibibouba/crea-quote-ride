
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PricingTableData } from './types';

export const generatePricingTable = (doc: jsPDF, data: PricingTableData, startY: number): void => {
  const tableRows = data.rows.map(row => [
    row.description,
    `${row.priceHT.toFixed(2)}€`,
    `${(row.priceTTC - row.priceHT).toFixed(2)}€ (${row.tvaRate}%)`,
    `${row.priceTTC.toFixed(2)}€`
  ]);
  
  // Add empty row before totals
  tableRows.push(['', '', '', '']);
  
  // Add totals row
  tableRows.push([
    'Total',
    `${data.totals.totalHT.toFixed(2)}€`,
    `${data.totals.totalTVA.toFixed(2)}€`,
    `${data.totals.totalTTC.toFixed(2)}€`
  ]);
  
  autoTable(doc, {
    startY: startY,
    head: [['Prestation', 'Montant HT', 'TVA', 'Montant TTC']],
    body: tableRows,
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
    foot: [tableRows[tableRows.length-1]],
    footStyles: {
      fillColor: [240, 240, 240],
      fontStyle: 'bold',
    }
  });
};
