
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatDuration } from '@/lib/formatDuration';
import { PdfContext } from './types';

export const generateTripDetails = (context: PdfContext) => {
  const { doc, quote } = context;
  let yPos = 120;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos, 195, yPos);
  
  // Add ride details header
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS DU TRAJET', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Format and display date/time
  const rideDate = new Date(quote.ride_date);
  const formattedDate = format(rideDate, 'dd MMMM yyyy', { locale: fr });
  const formattedTime = format(rideDate, 'HH:mm');
  
  yPos += 10;
  doc.text(`Date du trajet: ${formattedDate}`, 15, yPos);
  yPos += 5;
  doc.text(`Heure du trajet: ${formattedTime}`, 15, yPos);
  
  // Add locations
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Adresse de départ:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Wrap long address text
  yPos += 5;
  const departureLines = doc.splitTextToSize(quote.departure_location, 180);
  departureLines.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Adresse de destination:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  yPos += 5;
  const arrivalLines = doc.splitTextToSize(quote.arrival_location, 180);
  arrivalLines.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // Return trip info if applicable
  if (quote.has_return_trip) {
    yPos += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Aller-retour', 15, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    if (!quote.return_to_same_address && quote.custom_return_address) {
      yPos += 5;
      doc.text('Adresse de retour:', 15, yPos);
      const returnLines = doc.splitTextToSize(quote.custom_return_address, 180);
      returnLines.forEach(line => {
        yPos += 5;
        doc.text(line, 15, yPos);
      });
    } else {
      yPos += 5;
      doc.text('Retour à l\'adresse de départ', 15, yPos);
    }
  }
  
  return yPos;
};
