
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
import { Switch } from "@/components/ui/switch";
import { PercentIcon, Loader2, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PricingSettings {
  night_rate_enabled: boolean | null;
  night_rate_start: string | null;
  night_rate_end: string | null;
  night_rate_percentage: number | null;
}

const nightRatesSchema = z.object({
  night_rate_enabled: z.boolean().default(false),
  night_rate_start: z.string().optional().nullable(),
  night_rate_end: z.string().optional().nullable(),
  night_rate_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
});

interface NightRatesFormProps {
  settings: PricingSettings;
  onSave: (values: z.infer<typeof nightRatesSchema>) => Promise<void>;
  saving: boolean;
}

const NightRatesForm = ({ settings, onSave, saving }: NightRatesFormProps) => {
  const form = useForm<z.infer<typeof nightRatesSchema>>({
    resolver: zodResolver(nightRatesSchema),
    defaultValues: {
      night_rate_enabled: settings.night_rate_enabled || false,
      night_rate_start: settings.night_rate_start || "20:00",
      night_rate_end: settings.night_rate_end || "06:00",
      night_rate_percentage: settings.night_rate_percentage || 15,
    },
  });

  // Debug
  console.log("NightRatesForm settings:", settings);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Ces paramètres sont les tarifs de nuit par défaut. Chaque véhicule peut avoir ses propres paramètres 
            de tarif de nuit qui auront priorité sur ces valeurs globales.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="night_rate_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Activer les tarifs de nuit</FormLabel>
                <FormDescription>
                  Appliquer une majoration aux courses effectuées pendant la nuit
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Input type="number" step="0.01" {...field} />
                    <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
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

export default NightRatesForm;
