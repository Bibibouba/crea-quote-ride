
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import LoginButton from './LoginButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError("Veuillez saisir votre email et mot de passe");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // signIn already handles toast notifications on success
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Afficher un message d'erreur plus user-friendly
      if (error.code === 'invalid_credentials') {
        setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      } else {
        setError(error.message || "Une erreur s'est produite lors de la tentative de connexion");
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
        {error && (
          <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive">
            {error}
          </div>
        )}
        <EmailField email={email} setEmail={setEmail} />
        <PasswordField password={password} setPassword={setPassword} />
        <LoginButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default LoginForm;
