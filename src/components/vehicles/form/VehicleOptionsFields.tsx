
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '@/types/vehicle';

type VehicleOptionsFieldsProps = {
  form: UseFormReturn<VehicleFormValues>;
};

const VehicleOptionsFields: React.FC<VehicleOptionsFieldsProps> = ({ form }) => {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="is_luxury"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Véhicule de luxe</FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Véhicule actif</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default VehicleOptionsFields;
