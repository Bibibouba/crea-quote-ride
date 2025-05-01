
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ClientInfoStepProps {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
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
  phone,
  setPhone,
  isSubmitting,
  handleSubmit,
  handlePreviousStep
}) => {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="font-medium">Vos coordonnées</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button type="button" variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto order-1 sm:order-none">
          Retour
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto order-0 sm:order-none">
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le devis'}
        </Button>
      </div>
    </form>
  );
};

export default ClientInfoStep;
