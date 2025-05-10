
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { inscriptionFormSchema, InscriptionFormValues } from '@/schemas/inscriptionSchema';
import PersonalInfoFields from './PersonalInfoFields';
import EmailField from './EmailField';
import PasswordFields from './PasswordFields';
import CompanyNameField from './CompanyNameField';
import TermsField from './TermsField';
import SubmitButton from './SubmitButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const InscriptionForm = () => {
  const { signUp, resendConfirmationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
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
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      console.log('Données d\'inscription soumises:', {
        ...data,
        password: '***' // Masquer le mot de passe dans les logs
      });
      
      const result = await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName
      });
      
      if (result.success) {
        setRegisteredEmail(data.email);
        setSuccessMessage(result.message);
        // Redirigeons vers la page de connexion après 5 secondes
        setTimeout(() => {
          navigate('/connexion');
        }, 5000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrorMessage("Une erreur s'est produite lors de l'inscription: " + (error.message || "Erreur inconnue"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!registeredEmail) return;
    
    setIsResending(true);
    
    try {
      const result = await resendConfirmationEmail(registeredEmail);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Inscription réussie!</AlertTitle>
            <AlertDescription className="text-green-700">
              {successMessage}
              <br />
              {registeredEmail && (
                <>
                  <p className="mt-2">Si vous ne recevez pas l'email dans votre boîte de réception, vérifiez également votre dossier spam/indésirables.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                  >
                    {isResending ? "Envoi en cours..." : "Renvoyer l'email de confirmation"}
                  </Button>
                </>
              )}
              <p className="mt-2">Vous allez être redirigé vers la page de connexion...</p>
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <PersonalInfoFields control={form.control} />
        <EmailField control={form.control} />
        <PasswordFields control={form.control} />
        <CompanyNameField control={form.control} />
        <TermsField control={form.control} />
        <SubmitButton isLoading={isLoading} />
        
        <div className="text-xs text-muted-foreground text-center space-y-2">
          <p>
            Aucune carte bancaire requise. Vous pourrez configurer vos tarifs et tester toutes les fonctionnalités pendant 14 jours.
          </p>
          <p>
            En vous inscrivant, vous recevrez un email de confirmation. Veuillez cliquer sur le lien dans cet email pour activer votre compte.
          </p>
        </div>
      </form>
    </Form>
  );
};

export default InscriptionForm;
