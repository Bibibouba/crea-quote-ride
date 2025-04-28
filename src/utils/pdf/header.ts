
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PdfContext } from './types';

export const generateHeader = async (context: PdfContext) => {
  const { doc, companyInfo, quote } = context;
  const { logoUrl } = companyInfo;
  
  // Set up the document
  doc.setFont('helvetica');
  doc.setFontSize(10);
  
  // Add logo if available
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, 'JPEG', 15, 15, 30, 20);
    } catch (error) {
      console.error('Erreur lors du chargement du logo:', error);
    }
  }
  
  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS DE TRANSPORT VTC', 105, 30, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`N° ${quote.id.substring(0, 8)}`, 105, 40, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Date d'émission: ${format(new Date(quote.created_at), 'dd/MM/yyyy', { locale: fr })}`, 195, 20, { align: 'right' });
};
