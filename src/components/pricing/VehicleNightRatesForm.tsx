
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

interface PricingSettings {
  night_rate_enabled?: boolean | null;
  night_rate_start?: string | null;
  night_rate_end?: string | null;
  night_rate_percentage?: number | null;
}

const nightRatesSchema = z.object({
  night_rate_enabled: z.boolean().default(false),
  night_rate_start: z.string().optional().nullable(),
  night_rate_end: z.string().optional().nullable(),
  night_rate_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
});

interface VehicleNightRatesFormProps {
  vehicleId: string;
  defaultSettings?: PricingSettings;
}

const VehicleNightRatesForm = ({ vehicleId, defaultSettings }: VehicleNightRatesFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vehicleSettings, setVehicleSettings] = useState<any>(null);

  useEffect(() => {
    const fetchVehicleSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicle_pricing_settings')
          .select('night_rate_enabled, night_rate_start, night_rate_end, night_rate_percentage')
          .eq('vehicle_id', vehicleId)
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

  const form = useForm<z.infer<typeof nightRatesSchema>>({
    resolver: zodResolver(nightRatesSchema),
    defaultValues: {
      night_rate_enabled: false,
      night_rate_start: "20:00",
      night_rate_end: "06:00",
      night_rate_percentage: 15,
    },
    values: {
      night_rate_enabled: vehicleSettings?.night_rate_enabled ?? defaultSettings?.night_rate_enabled ?? false,
      night_rate_start: vehicleSettings?.night_rate_start ?? defaultSettings?.night_rate_start ?? "20:00",
      night_rate_end: vehicleSettings?.night_rate_end ?? defaultSettings?.night_rate_end ?? "06:00",
      night_rate_percentage: vehicleSettings?.night_rate_percentage ?? defaultSettings?.night_rate_percentage ?? 15,
    }
  });

  // Mettre à jour les valeurs du formulaire lorsque les paramètres du véhicule sont chargés
  useEffect(() => {
    if (vehicleSettings) {
      form.reset({
        night_rate_enabled: vehicleSettings.night_rate_enabled ?? defaultSettings?.night_rate_enabled ?? false,
        night_rate_start: vehicleSettings.night_rate_start ?? defaultSettings?.night_rate_start ?? "20:00",
        night_rate_end: vehicleSettings.night_rate_end ?? defaultSettings?.night_rate_end ?? "06:00",
        night_rate_percentage: vehicleSettings.night_rate_percentage ?? defaultSettings?.night_rate_percentage ?? 15,
      });
    }
  }, [vehicleSettings, defaultSettings, form]);

  const onSubmit = async (values: z.infer<typeof nightRatesSchema>) => {
    setSaving(true);
    try {
      // Mise à jour des paramètres dans la nouvelle table
      const { error } = await supabase
        .from('vehicle_pricing_settings')
        .update({
          night_rate_enabled: values.night_rate_enabled,
          night_rate_start: values.night_rate_start,
          night_rate_end: values.night_rate_end,
          night_rate_percentage: values.night_rate_percentage,
        })
        .eq('vehicle_id', vehicleId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Les paramètres de tarif de nuit ont été mis à jour",
      });
      
      setVehicleSettings({
        ...vehicleSettings,
        night_rate_enabled: values.night_rate_enabled,
        night_rate_start: values.night_rate_start,
        night_rate_end: values.night_rate_end,
        night_rate_percentage: values.night_rate_percentage
      });
    } catch (error) {
      console.error('Error saving night rate settings:', error);
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
          name="night_rate_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Activer les tarifs de nuit</FormLabel>
                <FormDescription>
                  Appliquer une majoration aux courses effectuées pendant la nuit pour ce véhicule
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

export default VehicleNightRatesForm;
