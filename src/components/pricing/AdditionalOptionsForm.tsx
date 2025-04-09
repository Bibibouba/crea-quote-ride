
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
import { Textarea } from "@/components/ui/textarea";
import { PercentIcon, Loader2, Save } from 'lucide-react';

interface AdditionalOptions {
  minimum_trip_fare: number | null;
  minimum_trip_minutes: number | null;
  holiday_sunday_percentage: number | null;
  service_area: string | null;
}

const additionalOptionsSchema = z.object({
  minimum_trip_fare: z.coerce.number().min(0, "Le tarif minimum doit être positif"),
  minimum_trip_minutes: z.coerce.number().min(0, "La durée minimum doit être positive"),
  holiday_sunday_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
  service_area: z.string().optional().nullable(),
});

interface AdditionalOptionsFormProps {
  settings: AdditionalOptions;
  onSave: (values: z.infer<typeof additionalOptionsSchema>) => Promise<void>;
  saving: boolean;
}

const AdditionalOptionsForm = ({ settings, onSave, saving }: AdditionalOptionsFormProps) => {
  const form = useForm<z.infer<typeof additionalOptionsSchema>>({
    resolver: zodResolver(additionalOptionsSchema),
    defaultValues: {
      minimum_trip_fare: settings.minimum_trip_fare || 0,
      minimum_trip_minutes: settings.minimum_trip_minutes || 0,
      holiday_sunday_percentage: settings.holiday_sunday_percentage || 15,
      service_area: settings.service_area || '',
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
                  <Input type="number" step="0.01" {...field} />
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
            name="minimum_trip_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée minimum de course (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Durée minimum facturée pour une course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="holiday_sunday_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Majoration jours fériés et dimanches (%)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type="number" step="0.01" {...field} />
                  <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormDescription>
                Pourcentage de majoration appliqué les dimanches et jours fériés
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="service_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone de service</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Décrivez votre zone de service (villes, régions, etc.)"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Cette information sera affichée sur votre site web
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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

export default AdditionalOptionsForm;
