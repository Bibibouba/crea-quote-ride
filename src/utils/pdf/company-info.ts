
import { jsPDF } from 'jspdf';
import { PdfContext } from './types';

export const generateCompanyInfo = (context: PdfContext) => {
  const { doc, companyInfo } = context;
  const { companyName, contactFirstName, contactLastName, contactEmail, companyAddress, siret, vatNumber } = companyInfo;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CHAUFFEUR VTC', 15, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  doc.text(companyName, 15, 70);
  doc.text(`${contactFirstName} ${contactLastName}`, 15, 75);
  
  if (companyAddress) {
    const addressLines = companyAddress.split('\n');
    let yPos = 80;
    addressLines.forEach(line => {
      doc.text(line, 15, yPos);
      yPos += 5;
    });
  }
  
  if (contactEmail) {
    doc.text(`Email: ${contactEmail}`, 15, 95);
  }
  
  if (siret) {
    doc.text(`SIRET: ${siret}`, 15, 100);
  }
  
  if (vatNumber) {
    doc.text(`TVA: ${vatNumber}`, 15, 105);
  }
};
