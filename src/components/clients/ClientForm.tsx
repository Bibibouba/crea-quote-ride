
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { clientFormSchema, ClientFormValues } from './client-form/ClientFormSchema';
import ClientTypeSelector from './client-form/ClientTypeSelector';
import PersonalClientForm from './client-form/PersonalClientForm';
import CompanyClientForm from './client-form/CompanyClientForm';
import ClientFormFooter from './client-form/ClientFormFooter';
import { Client } from '@/types/client';

export interface ClientFormProps {
  initialData: Partial<Client>;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClientForm = ({ initialData, onSuccess, onCancel }: ClientFormProps) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      client_type: initialData.client_type || 'personal',
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      company_name: initialData.company_name || '',
      company_address: initialData.company_address || '',
      company_siret: initialData.company_siret || '',
      contact_name: initialData.contact_name || '',
      contact_email: initialData.contact_email || '',
      contact_phone: initialData.contact_phone || '',
      notes: initialData.notes || '',
    }
  });

  const clientType = form.watch('client_type');

  const onSubmit = async (data: ClientFormValues) => {
    try {
      // Handle submission
      onSuccess();
    } catch (error) {
      console.error('Error submitting client form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ClientTypeSelector control={form.control} />
        
        {clientType === 'personal' ? (
          <PersonalClientForm control={form.control} />
        ) : (
          <CompanyClientForm control={form.control} />
        )}
        
        <ClientFormFooter control={form.control} />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData.id ? 'Mettre à jour' : 'Ajouter le client'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
