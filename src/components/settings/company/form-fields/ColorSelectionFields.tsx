
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
import { CompanySettingsFormValues } from '../CompanySettingsForm';

interface ColorSelectionFieldsProps {
  control: Control<CompanySettingsFormValues>;
}

const ColorSelectionFields = ({ control }: ColorSelectionFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="primary_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Couleur principale</FormLabel>
            <FormControl>
              <div className="flex space-x-2">
                <Input 
                  type="color" 
                  {...field} 
                  value={field.value || '#3B82F6'} 
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  {...field} 
                  value={field.value || '#3B82F6'} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="secondary_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Couleur secondaire</FormLabel>
            <FormControl>
              <div className="flex space-x-2">
                <Input 
                  type="color" 
                  {...field} 
                  value={field.value || '#10B981'} 
                  className="w-12 h-10 p-1"
                />
                <Input 
                  type="text" 
                  {...field} 
                  value={field.value || '#10B981'} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ColorSelectionFields;
