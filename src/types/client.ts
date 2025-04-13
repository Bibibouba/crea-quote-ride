
export type ClientType = 'personal' | 'business' | 'corporate';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Client {
  id: string;
  driver_id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  company_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  client_type: ClientType;
  gender?: Gender;
  client_code?: string;
  created_at?: string;
  updated_at?: string;
}

export type ClientCreate = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
