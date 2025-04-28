
import { Quote } from '@/types/quote';

export interface CompanyInfo {
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  siret?: string;
  vatNumber?: string;
  companyAddress?: string;
  logoUrl?: string;
}

export interface ClientInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface PdfContext {
  doc: jsPDF;
  quote: Quote;
  companyInfo: CompanyInfo;
  clientInfo: ClientInfo;
}
