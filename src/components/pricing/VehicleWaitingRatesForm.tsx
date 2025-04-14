
import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

interface PricingSettings {
  wait_price_per_15min?: number | null;
  wait_night_enabled?: boolean | null;
  wait_night_start?: string | null;
  wait_night_end?: string | null;
  wait_night_percentage?: number | null;
}

const waitingRatesSchema = z.object({
  wait_price_per_15min: z.coerce.number().min(0, "Le tarif d'attente doit être positif"),
  wait_night_enabled: z.boolean().default(false),
  wait_night_start: z.string().optional().nullable(),
  wait_night_end: z.string().optional().nullable(),
  wait_night_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
});

interface VehicleWaitingRatesFormProps {
  vehicleId: string;
  defaultSettings?: PricingSettings;
}

const VehicleWaitingRatesForm = ({ vehicleId, defaultSettings }: VehicleWaitingRatesFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vehicleSettings, setVehicleSettings] = useState<any>(null);

  useEffect(() => {
    const fetchVehicleSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('wait_price_per_15min, wait_night_enabled, wait_night_start, wait_night_end, wait_night_percentage')
          .eq('id', vehicleId)
          .single();
          
        if (error) throw error;
        setVehicleSettings(data);
      } catch (error) {
        console.error('Error fetching vehicle settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres du véhicule",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleSettings();
  }, [vehicleId, toast]);

  const form = useForm<z.infer<typeof waitingRatesSchema>>({
    resolver: zodResolver(waitingRatesSchema),
    defaultValues: {
      wait_price_per_15min: 7.5,
      wait_night_enabled: false,
      wait_night_start: "20:00",
      wait_night_end: "06:00",
      wait_night_percentage: 15,
    },
    values: {
      wait_price_per_15min: vehicleSettings?.wait_price_per_15min ?? defaultSettings?.wait_price_per_15min ?? 7.5,
      wait_night_enabled: vehicleSettings?.wait_night_enabled ?? defaultSettings?.wait_night_enabled ?? false,
      wait_night_start: vehicleSettings?.wait_night_start ?? defaultSettings?.wait_night_start ?? "20:00",
      wait_night_end: vehicleSettings?.wait_night_end ?? defaultSettings?.wait_night_end ?? "06:00",
      wait_night_percentage: vehicleSettings?.wait_night_percentage ?? defaultSettings?.wait_night_percentage ?? 15,
    }
  });

  // Mettre à jour les valeurs du formulaire lorsque les paramètres du véhicule sont chargés
  useEffect(() => {
    if (vehicleSettings) {
      form.reset({
        wait_price_per_15min: vehicleSettings.wait_price_per_15min ?? defaultSettings?.wait_price_per_15min ?? 7.5,
        wait_night_enabled: vehicleSettings.wait_night_enabled ?? defaultSettings?.wait_night_enabled ?? false,
        wait_night_start: vehicleSettings.wait_night_start ?? defaultSettings?.wait_night_start ?? "20:00",
        wait_night_end: vehicleSettings.wait_night_end ?? defaultSettings?.wait_night_end ?? "06:00",
        wait_night_percentage: vehicleSettings.wait_night_percentage ?? defaultSettings?.wait_night_percentage ?? 15,
      });
    }
  }, [vehicleSettings, defaultSettings, form]);

  const onSubmit = async (values: z.infer<typeof waitingRatesSchema>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          wait_price_per_15min: values.wait_price_per_15min,
          wait_night_enabled: values.wait_night_enabled,
          wait_night_start: values.wait_night_start,
          wait_night_end: values.wait_night_end,
          wait_night_percentage: values.wait_night_percentage,
        })
        .eq('id', vehicleId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Les paramètres de tarif d'attente ont été mis à jour",
      });
      
      setVehicleSettings({
        ...vehicleSettings,
        wait_price_per_15min: values.wait_price_per_15min,
        wait_night_enabled: values.wait_night_enabled,
        wait_night_start: values.wait_night_start,
        wait_night_end: values.wait_night_end,
        wait_night_percentage: values.wait_night_percentage,
      });
    } catch (error) {
      console.error('Error saving waiting rate settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  value={field.value?.toString() || '0'}
                />
              </FormControl>
              <FormDescription>
                Tarif spécifique à ce véhicule pour le temps d'attente (par tranche de 15 minutes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        
        <FormField
          control={form.control}
          name="wait_night_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Tarifs d'attente de nuit</FormLabel>
                <FormDescription>
                  Appliquer une majoration au temps d'attente pendant la nuit pour ce véhicule
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
                        value={field.value?.toString() || '0'}
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
