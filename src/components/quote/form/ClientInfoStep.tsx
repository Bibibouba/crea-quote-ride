
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ClientInfoSection from './ClientInfoSection';

interface ClientInfoStepProps {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePreviousStep: () => void;
}

const ClientInfoStep: React.FC<ClientInfoStepProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  isSubmitting,
  handleSubmit,
  handlePreviousStep
}) => {
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false
  });
  
  const validateForm = (): boolean => {
    const newErrors = {
      firstName: !firstName.trim(),
      lastName: !lastName.trim(),
      email: !email.trim() || !email.includes('@')
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await handleSubmit(e);
    }
  };
  
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <ClientInfoSection
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        errors={errors}
      />
      
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handlePreviousStep} 
          className="w-full sm:w-auto order-1 sm:order-none"
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto order-0 sm:order-none bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le devis'}
        </Button>
      </div>
    </form>
  );
};

export default ClientInfoStep;
