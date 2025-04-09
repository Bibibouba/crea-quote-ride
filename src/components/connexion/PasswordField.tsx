
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface PasswordFieldProps {
  password: string;
  setPassword: (password: string) => void;
}

const PasswordField = ({ password, setPassword }: PasswordFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="password">Mot de passe</Label>
        <Link to="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
          Mot de passe oublié?
        </Link>
      </div>
      <Input 
        id="password" 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
  );
};

export default PasswordField;
