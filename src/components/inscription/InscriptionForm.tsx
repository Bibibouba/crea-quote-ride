
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { inscriptionFormSchema, InscriptionFormValues } from '@/schemas/inscriptionSchema';
import PersonalInfoFields from './PersonalInfoFields';
import EmailField from './EmailField';
import PasswordFields from './PasswordFields';
import CompanyNameField from './CompanyNameField';
import TermsField from './TermsField';
import SubmitButton from './SubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const InscriptionForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    
    try {
      // 1. Create user in Supabase Auth
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

      if (!authData.user) {
        throw new Error("Échec de la création de l'utilisateur");
      }

      // Insert profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          company_name: data.companyName
        });

      if (profileError) throw profileError;

      // 2. Create a client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          driver_id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          entreprise: data.companyName, // Updated to match database schema
          client_type: 'personal'
        })
        .select()
        .single();

      if (clientError) {
        console.error('Error creating client:', clientError);
        throw clientError;
      }

      // 3. Create an entry in the utilisations table
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
        description: "Votre période d'essai de 14 jours a démarré. Vous allez être redirigé vers la page de connexion.",
      });
      
      // Redirect to connexion page after 2 seconds
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      // Display user-friendly error message
      if (error.code === 'user_already_exists') {
        setError('Cet email est déjà utilisé. Veuillez essayer avec un autre email ou vous connecter.');
      } else if (error.code === 'invalid_email') {
        setError('Email invalide. Veuillez vérifier votre adresse email.');
      } else if (error.code === 'weak_password') {
        setError('Mot de passe trop faible. Utilisez au moins 6 caractères.');
      } else {
        setError(error.message || "Une erreur s'est produite lors de l'inscription");
      }
      
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
