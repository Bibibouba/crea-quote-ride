
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

interface CompanyNameFieldProps {
  control: Control<InscriptionFormValues>;
}

const CompanyNameField = ({ control }: CompanyNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="companyName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom de votre entreprise</FormLabel>
          <FormControl>
            <Input placeholder="VTC Premium Services" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CompanyNameField;
