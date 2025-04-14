
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PercentIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface VehiclePricingFieldsProps {
  form: UseFormReturn<any>;
}

const VehiclePricingFields: React.FC<VehiclePricingFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="min_trip_distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance minimale (km)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.1" 
                  placeholder="0"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Si la course est inférieure à cette distance, le tarif minimum sera appliqué
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="night_rate_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Tarif de nuit spécifique</FormLabel>
              <FormDescription>
                Définir un tarif de nuit spécifique pour ce véhicule
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch('night_rate_enabled') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-4 border-l-2 border-primary/20">
          <FormField
            control={form.control}
            name="night_rate_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de début</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="night_rate_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="night_rate_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pourcentage de majoration (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="15"
                      {...field}
                      value={field.value || ''} 
                    />
                    <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default VehiclePricingFields;
