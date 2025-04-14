
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import LoginButton from './LoginButton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Email not confirmed') {
        setErrorMessage("Votre email n'a pas été confirmé. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.");
      } else {
        setErrorMessage(error.message || "Une erreur s'est produite lors de la connexion");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <EmailField email={email} setEmail={setEmail} />
        <PasswordField password={password} setPassword={setPassword} />
        <LoginButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default LoginForm;
