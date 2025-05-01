
import { jsPDF } from 'jspdf';
import { PdfContext } from './types';

export const generateFooter = (context: PdfContext, startY: number) => {
  const { doc, companyInfo } = context;
  
  // Add signature area
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Bon pour accord', 140, startY);
  doc.text('Date et signature du client:', 140, startY + 10);
  
  // Add notes and conditions on a new page
  doc.addPage();
  let yPos = 20;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONDITIONS ET NOTES', 15, yPos);
  doc.setFont('helvetica', 'normal');
  
  const conditionsText = [
    "• Validité de l'offre : ce devis est valable 7 jours à compter de sa date d'émission.",
    "• Le paiement s'effectue à la réception de la facture.",
    "• La réservation est confirmée à la réception du devis signé.",
    "• Toute modification du trajet pourra entraîner une révision du tarif.",
    "• Annulation sans frais jusqu'à 24h avant le départ. Au-delà, 50% du montant sera facturé."
  ];
  
  yPos += 10;
  conditionsText.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 6;
  });
  
  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} sur ${pageCount}`, 195, 287, { align: 'right' });
    
    if (companyInfo.companyName) {
      doc.text(companyInfo.companyName, 15, 287);
    }
  }
};
