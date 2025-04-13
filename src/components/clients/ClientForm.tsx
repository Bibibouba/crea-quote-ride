import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client, ClientType } from '@/types/client';
import { Form } from '@/components/ui/form';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';

// Import the refactored components
import ClientTypeSelector from './client-form/ClientTypeSelector';
import PersonalClientForm from './client-form/PersonalClientForm';
import CompanyClientForm from './client-form/CompanyClientForm';
import ClientFormFooter from './client-form/ClientFormFooter';
import { clientSchema, ClientFormValues, personalClientSchema, companyClientSchema } from './client-form/ClientFormSchema';

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Client>;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  onSuccess, 
  onCancel, 
  initialData 
}) => {
  const { addClient } = useClients();
  const { toast } = useToast();
  const [clientType, setClientType] = useState<ClientType>(
    initialData?.client_type || 'personal'
  );

  const defaultValues: ClientFormValues = {
    first_name: '',
    last_name: '',
    email: '',
    client_type: 'personal' as ClientType,
    gender: 'prefer_not_to_say' as Gender,
    company_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    notes: '',
    client_code: '',
  };

  const genderOptions = [
    { value: 'male' as Gender, label: 'Monsieur' },
    { value: 'female' as Gender, label: 'Madame' },
    { value: 'other' as Gender, label: 'Autre' },
    { value: 'prefer_not_to_say' as Gender, label: 'Ne pas préciser' },
  ];

  const formOptionsByType = {
    'personal': PersonalClientForm,
    'business': CompanyClientForm,
    'corporate': CompanyClientForm
  };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_type: clientType,
      ...(initialData as any),
    },
  });

  // Handle type change and reset form with new type
  const handleClientTypeChange = (type: ClientType) => {
    setClientType(type);
    form.reset({
      client_type: type,
      // Preserve common fields if they exist
      first_name: form.getValues().first_name,
      last_name: form.getValues().last_name,
      email: form.getValues().email,
      phone: form.getValues().phone,
      address: form.getValues().address,
      comments: form.getValues().comments,
    });
  };

  const onSubmit = async (data: ClientFormValues) => {
    try {
      // Make sure we have all required fields based on client type
      if (clientType === 'personal') {
        const personalData = data as typeof personalClientSchema._type;
        await addClient.mutateAsync({
          client_type: 'personal',
          gender: personalData.gender,
          first_name: personalData.first_name,
          last_name: personalData.last_name,
          email: personalData.email,
          phone: personalData.phone,
          address: personalData.address,
          comments: personalData.comments,
          birth_date: personalData.birth_date,
        });
      } else {
        const companyData = data as typeof companyClientSchema._type;
        await addClient.mutateAsync({
          client_type: 'company',
          company_name: companyData.company_name,
          first_name: companyData.first_name,
          last_name: companyData.last_name,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          siret: companyData.siret,
          vat_number: companyData.vat_number,
          website: companyData.website,
          business_type: companyData.business_type,
          client_code: companyData.client_code,
          comments: companyData.comments,
        });
      }
      
      toast({
        title: 'Client ajouté',
        description: 'Le client a été ajouté avec succès',
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'ajout du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Client type selector */}
        <ClientTypeSelector 
          clientType={clientType} 
          onClientTypeChange={handleClientTypeChange} 
        />

        <div className="grid gap-6">
          {/* Render either personal or company form based on client type */}
          {clientType === 'personal' ? (
            <PersonalClientForm form={form} />
          ) : (
            <CompanyClientForm form={form} />
          )}
        </div>

        {/* Form footer with action buttons */}
        <ClientFormFooter 
          onCancel={onCancel} 
          isSubmitting={addClient.isPending} 
        />
      </form>
    </Form>
  );
};

export default ClientForm;
