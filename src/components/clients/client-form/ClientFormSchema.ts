
import { z } from 'zod';
import { ClientType, Gender } from '@/types/client';

// Schema for personal client
export const personalClientSchema = z.object({
  client_type: z.literal('personal'),
  gender: z.enum(['Madame', 'Mademoiselle', 'Monsieur']).optional(),
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  birth_date: z.string().optional(),
});

// Schema for company client
export const companyClientSchema = z.object({
  client_type: z.literal('business'),
  company_name: z.string().min(1, 'Le nom de la société est requis'),
  first_name: z.string().min(1, 'Le prénom du contact est requis'),
  last_name: z.string().min(1, 'Le nom du contact est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  siret: z.string().optional(),
  vat_number: z.string().optional(),
  website: z.string().optional(),
  business_type: z.string().optional(),
  client_code: z.string().optional(),
  notes: z.string().optional(),
});

// Combined schema
export const clientSchema = z.discriminatedUnion('client_type', [
  personalClientSchema,
  companyClientSchema,
]);

export type ClientFormValues = z.infer<typeof clientSchema>;
