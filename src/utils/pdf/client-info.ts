
import { jsPDF } from 'jspdf';
import { PdfContext } from './types';

export const generateClientInfo = (context: PdfContext) => {
  const { doc, clientInfo } = context;
  const { firstName, lastName, email, phone } = clientInfo;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', 140, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  doc.text(`${firstName} ${lastName}`, 140, 70);
  
  if (email) {
    doc.text(`Email: ${email}`, 140, 75);
  }
  
  if (phone) {
    doc.text(`Téléphone: ${phone}`, 140, 80);
  }
};
