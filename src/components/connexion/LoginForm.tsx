
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import LoginButton from './LoginButton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const { signIn, user, resendConfirmationEmail, cleanupAuthState } = useAuth();
  const location = useLocation();

  // Vérifier si l'utilisateur vient de confirmer son email
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'signup' && params.get('error_description') === 'Email link confirmed') {
      setSuccessMessage('Votre email a été confirmé avec succès! Vous pouvez maintenant vous connecter.');
    }

    // Nettoyer l'état d'authentification au chargement pour éviter les problèmes
    cleanupAuthState();
  }, [location, cleanupAuthState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setEmailConfirmationNeeded(false);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      if (error.message && error.message.includes('Email not confirmed')) {
        setEmailConfirmationNeeded(true);
        setErrorMessage("Votre email n'a pas été confirmé. Veuillez vérifier votre boîte de réception ou cliquer sur le bouton ci-dessous pour recevoir un nouvel email de confirmation.");
      } else if (error.message && error.message.includes('Invalid login credentials')) {
        setErrorMessage("Email ou mot de passe incorrect.");
      } else {
        setErrorMessage(error.message || "Une erreur s'est produite lors de la connexion");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setErrorMessage("Veuillez entrer votre adresse email avant de demander un nouvel email de confirmation.");
      return;
    }
    
    setIsResending(true);
    
    try {
      const result = await resendConfirmationEmail(email);
      if (result.success) {
        setSuccessMessage(result.message);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message);
      }
    } finally {
      setIsResending(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Succès</AlertTitle>
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <EmailField email={email} setEmail={setEmail} />
        <PasswordField password={password} setPassword={setPassword} />
        
        {emailConfirmationNeeded && (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleResendConfirmation}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Renvoyer l'email de confirmation"
            )}
          </Button>
        )}
        
        <LoginButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default LoginForm;
