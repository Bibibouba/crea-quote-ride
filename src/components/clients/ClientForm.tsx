
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client, ClientType, Gender } from '@/types/client';
import { Form } from '@/components/ui/form';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';

// Import the refactored components
import ClientTypeSelector from './client-form/ClientTypeSelector';
import PersonalClientForm from './client-form/PersonalClientForm';
import CompanyClientForm from './client-form/CompanyClientForm';
import ClientFormFooter from './client-form/ClientFormFooter';
import { clientSchema, ClientFormValues } from './client-form/ClientFormSchema';

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
      notes: form.getValues().notes,
    });
  };

  const onSubmit = async (data: ClientFormValues) => {
    try {
      await addClient.mutateAsync({
        ...data,
        client_type: clientType,
      });
      
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
    <FormProvider {...form}>
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
              <PersonalClientForm />
            ) : (
              <CompanyClientForm />
            )}
          </div>

          {/* Form footer with action buttons */}
          <ClientFormFooter 
            onCancel={onCancel} 
            isSubmitting={addClient.isPending} 
          />
        </form>
      </Form>
    </FormProvider>
  );
};

export default ClientForm;
