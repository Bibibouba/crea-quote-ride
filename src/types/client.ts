
export type ClientType = 'personal' | 'company';
export type Gender = 'Madame' | 'Mademoiselle' | 'Monsieur';

export type Client = {
  id: string;
  driver_id: string;
  client_type: ClientType;
  // Personal information
  gender?: Gender;
  first_name: string;
  last_name: string;
  email: string;
  // Company information
  company_name?: string;
  // Optional fields
  phone?: string;
  address?: string;
  comments?: string;
  birth_date?: string;
  // Company additional fields
  siret?: string;
  vat_number?: string;
  website?: string;
  business_type?: string;
  client_code?: string;
  created_at: string;
  updated_at: string;
};
