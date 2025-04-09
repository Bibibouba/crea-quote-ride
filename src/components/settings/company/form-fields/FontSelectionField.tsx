
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Control } from 'react-hook-form';
import { CompanySettingsFormValues } from '../CompanySettingsForm';

interface FontSelectionFieldProps {
  control: Control<CompanySettingsFormValues>;
}

const FontSelectionField = ({ control }: FontSelectionFieldProps) => {
  return (
    <FormField
      control={control}
      name="font_family"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Police de caractères</FormLabel>
          <FormControl>
            <ToggleGroup 
              type="single" 
              value={field.value || 'Inter'} 
              onValueChange={field.onChange} 
              className="flex flex-wrap"
            >
              <ToggleGroupItem value="Inter" className="px-4">
                <span className="font-['Inter']">Inter</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="Roboto" className="px-4">
                <span className="font-['Roboto']">Roboto</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="Poppins" className="px-4">
                <span className="font-['Poppins']">Poppins</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="Montserrat" className="px-4">
                <span className="font-['Montserrat']">Montserrat</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FontSelectionField;
