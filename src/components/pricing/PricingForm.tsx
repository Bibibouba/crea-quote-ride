
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
import { Loader2, Save } from 'lucide-react';
import { usePricing } from '@/hooks/use-pricing';

const basePricingSchema = z.object({
  base_fare: z.coerce.number().min(0, "Le tarif de base doit être positif"),
  price_per_km: z.coerce.number().min(0, "Le prix par km doit être positif"),
  waiting_fee_per_minute: z.coerce.number().min(0, "Le tarif d'attente doit être positif"),
  min_fare: z.coerce.number().min(0, "Le tarif minimum doit être positif"),
});

const PricingForm = () => {
  const { pricingSettings, saveSettings, savingSettings } = usePricing();
  
  const form = useForm<z.infer<typeof basePricingSchema>>({
    resolver: zodResolver(basePricingSchema),
    defaultValues: {
      base_fare: pricingSettings?.base_fare || 0,
      price_per_km: pricingSettings?.price_per_km || 0,
      waiting_fee_per_minute: pricingSettings?.waiting_fee_per_minute || 0,
      min_fare: pricingSettings?.min_fare || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof basePricingSchema>) => {
    await saveSettings(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="base_fare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif de base (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Montant fixe facturé au début de chaque course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price_per_km"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix par kilomètre (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Tarif par kilomètre parcouru
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="waiting_fee_per_minute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif d'attente par minute (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Tarif appliqué par minute d'attente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="min_fare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif minimum (€)</FormLabel>
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
        </div>
        
        <Button type="submit" disabled={savingSettings}>
          {savingSettings ? (
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

export default PricingForm;
