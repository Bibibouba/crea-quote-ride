
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ClientInfoSectionProps {
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  email: string;
  setEmail: (email: string) => void;
  errors?: {
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
  };
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  errors = {}
}) => {
  return (
    <div className="border rounded-md p-4 space-y-4 bg-gradient-to-r from-pastelBlue/30 to-transparent">
      <h3 className="font-medium text-primary">Vos coordonnées</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className={errors.firstName ? "text-destructive" : ""}>
            Prénom
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={cn(
              errors.firstName && "border-destructive bg-destructive/5 focus-visible:ring-destructive"
            )}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">Le prénom est requis</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className={errors.lastName ? "text-destructive" : ""}>
            Nom
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={cn(
              errors.lastName && "border-destructive bg-destructive/5 focus-visible:ring-destructive"
            )}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">Le nom est requis</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={cn(
            errors.email && "border-destructive bg-destructive/5 focus-visible:ring-destructive"
          )}
        />
        {errors.email && (
          <p className="text-sm text-destructive">L'email est requis</p>
        )}
      </div>
    </div>
  );
};

export default ClientInfoSection;
