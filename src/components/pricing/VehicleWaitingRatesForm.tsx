
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
import { PercentIcon, Loader2, Save } from 'lucide-react';

const waitingRatesSchema = z.object({
  wait_price_per_15min: z.coerce.number().min(0, "Le tarif d'attente doit être positif"),
  wait_night_enabled: z.boolean().default(false),
  wait_night_start: z.string().optional().nullable(),
  wait_night_end: z.string().optional().nullable(),
  wait_night_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
});

interface VehicleWaitingRatesFormProps {
  settings: any;
  onSave: (values: any) => Promise<void>;
  saving: boolean;
}

const VehicleWaitingRatesForm = ({ settings, onSave, saving }: VehicleWaitingRatesFormProps) => {
  const form = useForm<z.infer<typeof waitingRatesSchema>>({
    resolver: zodResolver(waitingRatesSchema),
    defaultValues: {
      wait_price_per_15min: settings?.wait_price_per_15min || 7.5,
      wait_night_enabled: settings?.wait_night_enabled || false,
      wait_night_start: settings?.wait_night_start || "20:00",
      wait_night_end: settings?.wait_night_end || "06:00",
      wait_night_percentage: settings?.wait_night_percentage || 15,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="wait_price_per_15min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarif par tranche de 15 minutes (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tarif appliqué pour le temps d'attente (par tranche de 15 minutes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="wait_night_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Tarifs d'attente de nuit</FormLabel>
                <FormDescription>
                  Appliquer une majoration au temps d'attente pendant la nuit
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
        
        {form.watch('wait_night_enabled') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="wait_night_start"
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
              name="wait_night_end"
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
              name="wait_night_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pourcentage de majoration (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        {...field}
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

export default VehicleWaitingRatesForm;
