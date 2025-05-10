
import { jsPDF } from 'jspdf';
import { Quote } from '@/types/quote';
import { supabase } from '@/integrations/supabase/client';
import { generateHeader } from './pdf/header';
import { generateCompanyInfo } from './pdf/company-info';
import { generateClientInfo } from './pdf/client-info';
import { generateTripDetails } from './pdf/trip-details';
import { generatePricingTable } from './pdf/pricing-table';
import { generateFooter } from './pdf/footer';
import { CompanyInfo, ClientInfo } from './pdf/types';

export const generateQuotePDF = async (quote: Quote): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Get driver info
  const { data: driverProfile, error: driverError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', quote.driver_id)
    .single();
  
  if (driverError || !driverProfile) {
    console.error('Erreur lors de la récupération des données du chauffeur:', driverError);
    throw new Error('Impossible de récupérer les données du chauffeur');
  }
  
  // Get company settings
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .eq('driver_id', quote.driver_id)
    .maybeSingle();
  
  if (companyError) {
    console.error('Erreur lors de la récupération des paramètres de l\'entreprise:', companyError);
  }
  
  // Prepare company info
  const companyInfo: CompanyInfo = {
    companyName: companySettings?.company_name || 'Service de VTC',
    contactFirstName: companySettings?.contact_first_name || driverProfile.first_name || '',
    contactLastName: companySettings?.contact_last_name || driverProfile.last_name || '',
    contactEmail: companySettings?.contact_email || driverProfile.email || '',
    siret: companySettings?.siret,
    vatNumber: companySettings?.vat_number,
    companyAddress: companySettings?.company_address,
    logoUrl: companySettings?.logo_url
  };
  
  // Prepare client info
  const clientInfo: ClientInfo = {
    firstName: quote.clients?.first_name || '',
    lastName: quote.clients?.last_name || '',
    email: quote.clients?.email,
    phone: quote.clients?.phone
  };
  
  // Create PDF context
  const context = { doc, quote, companyInfo, clientInfo };
  
  // Generate PDF sections
  await generateHeader(context);
  generateCompanyInfo(context);
  generateClientInfo(context);
  const tripDetailsEndY = generateTripDetails(context);
  generatePricingTable(context, tripDetailsEndY + 20);
  generateFooter(context, doc.lastAutoTable.finalY + 20);
  
  // Return the PDF as blob
  return doc.output('blob');
};
