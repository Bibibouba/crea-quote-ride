
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailFieldProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailField = ({ email, setEmail }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email" 
        type="email" 
        placeholder="exemple@votredomaine.com" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
  );
};

export default EmailField;
