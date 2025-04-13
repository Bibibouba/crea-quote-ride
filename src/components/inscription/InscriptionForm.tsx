
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { inscriptionFormSchema, InscriptionFormValues } from '@/schemas/inscriptionSchema';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PersonalInfoFields from './PersonalInfoFields';
import EmailField from './EmailField';
import PasswordFields from './PasswordFields';
import CompanyNameField from './CompanyNameField';
import TermsField from './TermsField';
import SubmitButton from './SubmitButton';

const InscriptionForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<InscriptionFormValues>({
    resolver: zodResolver(inscriptionFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      terms: false
    }
  });

  const onSubmit = async (data: InscriptionFormValues) => {
    setIsLoading(true);
    try {
      // 1. Créer un utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: data.companyName
          }
        }
      });

      if (authError) throw authError;

      // 2. Créer un client dans la table clients
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          nom: `${data.firstName} ${data.lastName}`,
          email: data.email,
          entreprise: data.companyName,
          // Le mot de passe est géré par Auth, pas besoin de le stocker dans la table clients
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // 3. Créer une entrée dans la table utilisations
      const applicationId = '9550b69a-c2df-4639-8b5e-d5c845b03b33';
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 14);

      const { error: utilisationError } = await supabase
        .from('utilisations')
        .insert({
          client_id: clientData.id,
          application_id: applicationId,
          date_debut_essai: today.toISOString(),
          date_fin_essai: endDate.toISOString(),
          statut_essai: 'actif'
        });

      if (utilisationError) throw utilisationError;

      toast({
        title: "Compte créé avec succès",
        description: "Votre période d'essai de 14 jours a démarré. Vous allez être redirigé vers le tableau de bord.",
      });
      
      // Rediriger vers le tableau de bord après quelques secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur lors de l'inscription",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields control={form.control} />
        <EmailField control={form.control} />
        <PasswordFields control={form.control} />
        <CompanyNameField control={form.control} />
        <TermsField control={form.control} />
        <SubmitButton isLoading={isLoading} />
        
        <p className="text-xs text-muted-foreground text-center">
          Aucune carte bancaire requise. Vous pourrez configurer vos tarifs et tester toutes les fonctionnalités pendant 14 jours.
        </p>
      </form>
    </Form>
  );
};

export default InscriptionForm;
