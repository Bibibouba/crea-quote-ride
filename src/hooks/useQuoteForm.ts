import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Quote } from '@/types/quote';
import { ClientType } from '@/types/client';

export interface WaitingTimeOption {
  value: number;
  label: string;
  price: number;
}

const quoteFormSchema = z.object({
  client_id: z.string().uuid().optional(),
  first_name: z.string().min(2, {
    message: "Le prénom doit comporter au moins 2 caractères.",
  }),
  last_name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  client_type: z.enum(['personal', 'business', 'corporate']),
  vehicle_id: z.string().uuid().optional().nullable(),
  departure_location: z.string().min(2, {
    message: "Le lieu de départ doit comporter au moins 2 caractères.",
  }),
  arrival_location: z.string().min(2, {
    message: "Le lieu d'arrivée doit comporter au moins 2 caractères.",
  }),
  departure_coordinates: z.array(z.number()).length(2),
  arrival_coordinates: z.array(z.number()).length(2),
  distance_km: z.number().min(0, {
    message: "La distance doit être supérieure à 0.",
  }),
  duration_minutes: z.number().min(0, {
    message: "La durée doit être supérieure à 0.",
  }),
  ride_date: z.string(),
  amount: z.number().min(0, {
    message: "Le montant doit être supérieur à 0.",
  }),
  status: z.enum(['pending', 'accepted', 'rejected', 'completed', 'cancelled']),
  has_return_trip: z.boolean().default(false),
  has_waiting_time: z.boolean().default(false),
  waiting_time_minutes: z.number().optional().nullable(),
  waiting_time_price: z.number().optional().nullable(),
  return_to_same_address: z.boolean().default(false),
  custom_return_address: z.string().optional().nullable(),
  return_coordinates: z.array(z.number()).length(2).optional().nullable(),
  return_distance_km: z.number().optional().nullable(),
  return_duration_minutes: z.number().optional().nullable(),
  quote_pdf: z.string().optional().nullable(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface UseQuoteFormProps {
  driverId: string;
  defaultValues?: Partial<QuoteFormValues>;
  onSubmit: (data: QuoteFormValues) => Promise<void>;
}

export const useQuoteForm = ({ driverId, defaultValues, onSubmit }: UseQuoteFormProps) => {
  const [isNewClient, setIsNewClient] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      status: 'pending',
      ...defaultValues,
    },
  });

  const { handleSubmit } = form;

  const submit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      if (isNewClient) {
        const newClient = await createClient({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          client_type: data.client_type,
          driver_id: driverId,
        });

        if (newClient) {
          const quoteData = {
            ...data,
            client_id: newClient.id,
            driver_id: driverId,
          };
          await onSubmit(quoteData);
        }
      } else {
        const quoteData = {
          ...data,
          driver_id: driverId,
        };
        await onSubmit(quoteData);
      }
    } finally {
      setSubmitting(false);
    }
  });

const createClient = async (clientData: {
  first_name: string;
  last_name: string;
  email: string;
  client_type: ClientType;
  driver_id: string;
}) => {
  try {
    // Set the full_name field required by the database
    const fullClientData = {
      ...clientData,
      full_name: `${clientData.first_name} ${clientData.last_name}`
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert(fullClientData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    toast.error('Erreur lors de la création du client');
    return null;
  }
};

  return {
    form,
    isNewClient,
    setIsNewClient,
    submit,
    submitting,
  };
};
