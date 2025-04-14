
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/types/vehicle';

type VehicleBasicInfoFieldsProps = {
  form: UseFormReturn<VehicleFormValues>;
};

const VehicleBasicInfoFields: React.FC<VehicleBasicInfoFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du véhicule</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Mercedes" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Modèle</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Classe E" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VehicleBasicInfoFields;
