
import React from 'react';
import { Control } from 'react-hook-form';
import { InscriptionFormValues } from '@/schemas/inscriptionSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface EmailFieldProps {
  control: Control<InscriptionFormValues>;
}

const EmailField = ({ control }: EmailFieldProps) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email professionnel</FormLabel>
          <FormControl>
            <Input type="email" placeholder="jean.dupont@votreentreprise.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailField;
