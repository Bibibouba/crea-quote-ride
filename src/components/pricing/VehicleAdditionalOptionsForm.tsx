
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PercentIcon, Loader2, Save } from 'lucide-react';

const additionalOptionsSchema = z.object({
  minimum_trip_fare: z.coerce.number().min(0, "Le tarif minimum doit être positif"),
  holiday_sunday_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
});

interface VehicleAdditionalOptionsFormProps {
  settings: any;
  onSave: (values: any) => Promise<void>;
  saving: boolean;
}

const VehicleAdditionalOptionsForm = ({ settings, onSave, saving }: VehicleAdditionalOptionsFormProps) => {
  const form = useForm<z.infer<typeof additionalOptionsSchema>>({
    resolver: zodResolver(additionalOptionsSchema),
    defaultValues: {
      minimum_trip_fare: settings?.minimum_trip_fare || 0,
      holiday_sunday_percentage: settings?.holiday_sunday_percentage || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minimum_trip_fare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif minimum de course (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Montant minimum facturé pour une course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="holiday_sunday_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Majoration dimanches et jours fériés (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      {...field}
                    />
                    <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>
                  Pourcentage de majoration les dimanches et jours fériés
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VehicleAdditionalOptionsForm;
