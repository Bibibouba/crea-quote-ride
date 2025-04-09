
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
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

interface TermsFieldProps {
  control: Control<InscriptionFormValues>;
}

const TermsField = ({ control }: TermsFieldProps) => {
  return (
    <FormField
      control={control}
      name="terms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              J'accepte les <Link to="/conditions" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsField;
