import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Quote } from '@/types/quote';
import { formatDuration } from '@/lib/formatDuration';
import { supabase } from '@/integrations/supabase/client';

export const generateQuotePDF = async (quote: Quote): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Get driver info avec déstructuration correcte
  const { data: driverProfile, error: driverError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, company_name')
    .eq('id', quote.driver_id)
    .single();
  
  if (driverError || !driverProfile) {
    console.error('Erreur lors de la récupération des données du chauffeur:', driverError);
  }
  
  // Get company settings if available avec déstructuration correcte
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .eq('driver_id', quote.driver_id)
    .maybeSingle();
  
  if (companyError) {
    console.error('Erreur lors de la récupération des paramètres de l\'entreprise:', companyError);
  }
  
  // Set up the document
  doc.setFont('helvetica');
  doc.setFontSize(10);
  
  // Add logo if available
  if (companySettings?.logo_url) {
    try {
      // This is a placeholder - actual image loading would need a way to convert URL to data
      // In a real implementation, you might need a server component or preloaded image
      doc.addImage(companySettings.logo_url, 'JPEG', 15, 15, 30, 20);
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
  
  // Add company info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CHAUFFEUR VTC', 15, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Use company_name from company settings if available
  const companyName = companySettings?.company_name || driverProfile?.company_name || 'Service de VTC';
  doc.text(companyName, 15, 70);
  
  if (driverProfile) {
    const contactFirstName = companySettings?.contact_first_name || driverProfile.first_name || '';
    const contactLastName = companySettings?.contact_last_name || driverProfile.last_name || '';
    const contactEmail = companySettings?.contact_email || driverProfile.email || '';

    doc.text(`${contactFirstName} ${contactLastName}`, 15, 75);
  }
  
  if (companySettings?.company_address) {
    const addressLines = companySettings.company_address.split('\n');
    let yPos = 80;
    addressLines.forEach(line => {
      doc.text(line, 15, yPos);
      yPos += 5;
    });
  }
  
  if (driverProfile?.email) {
    doc.text(`Email: ${driverProfile.email}`, 15, 95);
  }
  
  if (companySettings?.siret) {
    doc.text(`SIRET: ${companySettings.siret}`, 15, 100);
  }
  
  if (companySettings?.vat_number) {
    doc.text(`TVA: ${companySettings.vat_number}`, 15, 105);
  }
  
  // Add client info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', 140, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  if (quote.clients) {
    doc.text(`${quote.clients.first_name} ${quote.clients.last_name}`, 140, 70);
    if (quote.clients.email) {
      doc.text(`Email: ${quote.clients.email}`, 140, 75);
    }
    if (quote.clients.phone) {
      doc.text(`Téléphone: ${quote.clients.phone}`, 140, 80);
    }
  } else {
    doc.text('Client non spécifié', 140, 70);
  }
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 120, 195, 120);
  
  // Add ride details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS DU TRAJET', 15, 130);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Format ride date
  const rideDate = new Date(quote.ride_date);
  const formattedDate = format(rideDate, 'dd MMMM yyyy', { locale: fr });
  const formattedTime = format(rideDate, 'HH:mm');
  
  doc.text(`Date du trajet: ${formattedDate}`, 15, 140);
  doc.text(`Heure du trajet: ${formattedTime}`, 15, 145);
  
  // Add locations
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Adresse de départ:', 15, 155);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Wrap long address text
  const departureLines = doc.splitTextToSize(quote.departure_location, 180);
  let yPos = 160;
  departureLines.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Adresse de destination:', 15, yPos + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const arrivalLines = doc.splitTextToSize(quote.arrival_location, 180);
  yPos += 10;
  arrivalLines.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 5;
  });
  
  // If has return trip
  if (quote.has_return_trip) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Aller-retour', 15, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    if (!quote.return_to_same_address && quote.custom_return_address) {
      doc.text('Adresse de retour:', 15, yPos + 10);
      const returnLines = doc.splitTextToSize(quote.custom_return_address, 180);
      let returnYPos = yPos + 15;
      returnLines.forEach(line => {
        doc.text(line, 15, returnYPos);
        returnYPos += 5;
      });
      yPos = returnYPos;
    } else {
      doc.text('Retour à l\'adresse de départ', 15, yPos + 10);
      yPos += 10;
    }
  }
  
  // If has waiting time
  if (quote.has_waiting_time) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Temps d\'attente:', 15, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const hours = Math.floor(quote.waiting_time_minutes || 0 / 60);
    const minutes = (quote.waiting_time_minutes || 0) % 60;
    let waitingText = '';
    if (hours > 0) {
      waitingText += `${hours} heure${hours > 1 ? 's' : ''}`;
      if (minutes > 0) {
        waitingText += ` et ${minutes} minute${minutes > 1 ? 's' : ''}`;
      }
    } else {
      waitingText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    doc.text(waitingText, 15, yPos + 10);
    yPos += 10;
  }
  
  // Add vehicle info
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Véhicule:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const vehicleName = quote.vehicles?.name || 'Non spécifié';
  const vehicleModel = quote.vehicles?.model || '';
  doc.text(`${vehicleName} ${vehicleModel}`, 15, yPos + 5);
  
  // Add distance and duration info
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de trajet:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  doc.text(`Distance: ${quote.distance_km || 0} km`, 15, yPos + 5);
  doc.text(`Durée: ${formatDuration(quote.duration_minutes || 0)}`, 15, yPos + 10);
  
  if (quote.has_return_trip) {
    if (!quote.return_to_same_address) {
      doc.text(`Distance retour: ${quote.return_distance_km || 0} km`, 15, yPos + 15);
      doc.text(`Durée retour: ${formatDuration(quote.return_duration_minutes || 0)}`, 15, yPos + 20);
      yPos += 10;
    } else {
      doc.text('Retour: même distance et durée que l\'aller', 15, yPos + 15);
      yPos += 5;
    }
  }
  
  // Add pricing table
  yPos += 30;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TARIFICATION', 105, yPos, { align: 'center' });
  
  // Base price for one-way
  const oneWayPrice = quote.has_return_trip ? (quote.amount / 2) : quote.amount;
  
  // Calculate prices
  const returnPrice = quote.has_return_trip ? oneWayPrice : 0;
  const waitingPrice = quote.waiting_time_price || 0;
  
  // Create pricing table
  const pricingData = [];
  pricingData.push(['Prestation', 'Montant HT', 'TVA', 'Montant TTC']);
  
  // Assuming 10% TVA for transport
  const vatRate = 10; // 10%
  const waitingVatRate = 20; // 20%
  
  const oneWayPriceHT = oneWayPrice / (1 + vatRate/100);
  const oneWayTVA = oneWayPrice - oneWayPriceHT;
  
  pricingData.push(['Trajet aller', `${oneWayPriceHT.toFixed(2)}€`, `${oneWayTVA.toFixed(2)}€ (${vatRate}%)`, `${oneWayPrice.toFixed(2)}€`]);
  
  if (quote.has_return_trip) {
    const returnPriceHT = returnPrice / (1 + vatRate/100);
    const returnTVA = returnPrice - returnPriceHT;
    pricingData.push(['Trajet retour', `${returnPriceHT.toFixed(2)}€`, `${returnTVA.toFixed(2)}€ (${vatRate}%)`, `${returnPrice.toFixed(2)}€`]);
  }
  
  if (quote.has_waiting_time) {
    const waitingPriceHT = waitingPrice / (1 + waitingVatRate/100);
    const waitingTVA = waitingPrice - waitingPriceHT;
    pricingData.push([`Temps d'attente (${quote.waiting_time_minutes} min)`, `${waitingPriceHT.toFixed(2)}€`, `${waitingTVA.toFixed(2)}€ (${waitingVatRate}%)`, `${waitingPrice.toFixed(2)}€`]);
  }
  
  // Total row
  const totalHT = oneWayPriceHT + (quote.has_return_trip ? oneWayPriceHT : 0) + (quote.has_waiting_time ? (waitingPrice / (1 + waitingVatRate/100)) : 0);
  const totalTVA = quote.amount - totalHT;
  
  pricingData.push(['', '', '', '']);
  pricingData.push(['Total', `${totalHT.toFixed(2)}€`, `${totalTVA.toFixed(2)}€`, `${quote.amount.toFixed(2)}€`]);
  
  // Add table to document
  autoTable(doc, {
    startY: yPos + 5,
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
  
  // Add signature area first
  yPos = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Bon pour accord', 140, yPos);
  doc.text('Date et signature du client:', 140, yPos + 10);
  
  // Add notes and conditions on a new page
  doc.addPage();
  yPos = 20;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONDITIONS ET NOTES', 15, yPos);
  doc.setFont('helvetica', 'normal');
  
  let conditionsText = [
    "• Validité de l'offre : ce devis est valable 7 jours à compter de sa date d'émission.",
    "• Le paiement s'effectue à la réception de la facture.",
    "• La réservation est confirmée à la réception du devis signé.",
    "• Toute modification du trajet pourra entraîner une révision du tarif.",
    "• Annulation sans frais jusqu'à 24h avant le départ. Au-delà, 50% du montant sera facturé."
  ];
  
  // Add custom conditions if available
  if (companySettings?.discount_conditions) {
    conditionsText.push("");
    conditionsText.push(companySettings.discount_conditions);
  }
  
  yPos += 10;
  conditionsText.forEach(line => {
    doc.text(line, 15, yPos);
    yPos += 6;
  });
  
  // Add legal notices
  if (companySettings?.legal_notices) {
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Mentions légales:', 15, yPos);
    
    const legalLines = doc.splitTextToSize(companySettings.legal_notices, 180);
    yPos += 5;
    legalLines.forEach(line => {
      doc.text(line, 15, yPos);
      yPos += 5;
    });
  }
  
  // Add footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} sur ${pageCount}`, 195, 287, { align: 'right' });
    
    if (companyName) {
      doc.text(companyName, 15, 287);
    }
  }
  
  // Return the PDF as blob
  return doc.output('blob');
};
