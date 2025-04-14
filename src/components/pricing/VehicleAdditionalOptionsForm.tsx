
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
import { PercentIcon, Loader2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PricingSettings {
  minimum_trip_fare?: number | null;
  min_trip_distance?: number | null;
  holiday_sunday_percentage?: number | null;
}

const additionalOptionsSchema = z.object({
  minimum_trip_fare: z.coerce.number().min(0, "Le tarif minimum doit être positif"),
  min_trip_distance: z.coerce.number().min(0, "La distance minimum doit être positive"),
  holiday_sunday_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
});

interface VehicleAdditionalOptionsFormProps {
  vehicleId: string;
  defaultSettings?: PricingSettings;
}

const VehicleAdditionalOptionsForm = ({ vehicleId, defaultSettings }: VehicleAdditionalOptionsFormProps) => {
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
          .select('minimum_trip_fare, min_trip_distance, holiday_sunday_percentage')
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

  const form = useForm<z.infer<typeof additionalOptionsSchema>>({
    resolver: zodResolver(additionalOptionsSchema),
    defaultValues: {
      minimum_trip_fare: 0,
      min_trip_distance: 0,
      holiday_sunday_percentage: 0,
    },
    values: {
      minimum_trip_fare: vehicleSettings?.minimum_trip_fare ?? defaultSettings?.minimum_trip_fare ?? 0,
      min_trip_distance: vehicleSettings?.min_trip_distance ?? defaultSettings?.min_trip_distance ?? 0,
      holiday_sunday_percentage: vehicleSettings?.holiday_sunday_percentage ?? defaultSettings?.holiday_sunday_percentage ?? 0,
    }
  });

  // Mettre à jour les valeurs du formulaire lorsque les paramètres du véhicule sont chargés
  useEffect(() => {
    if (vehicleSettings) {
      form.reset({
        minimum_trip_fare: vehicleSettings.minimum_trip_fare ?? defaultSettings?.minimum_trip_fare ?? 0,
        min_trip_distance: vehicleSettings.min_trip_distance ?? defaultSettings?.min_trip_distance ?? 0,
        holiday_sunday_percentage: vehicleSettings.holiday_sunday_percentage ?? defaultSettings?.holiday_sunday_percentage ?? 0,
      });
    }
  }, [vehicleSettings, defaultSettings, form]);

  const onSubmit = async (values: z.infer<typeof additionalOptionsSchema>) => {
    setSaving(true);
    try {
      // Mise à jour des paramètres dans la nouvelle table
      const { error } = await supabase
        .from('vehicle_pricing_settings')
        .update({
          minimum_trip_fare: values.minimum_trip_fare,
          min_trip_distance: values.min_trip_distance,
          holiday_sunday_percentage: values.holiday_sunday_percentage,
        })
        .eq('vehicle_id', vehicleId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Les options supplémentaires ont été mises à jour",
      });
      
      setVehicleSettings({
        ...vehicleSettings,
        minimum_trip_fare: values.minimum_trip_fare,
        min_trip_distance: values.min_trip_distance,
        holiday_sunday_percentage: values.holiday_sunday_percentage
      });
    } catch (error) {
      console.error('Error saving additional options:', error);
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
                    step="0.01" 
                    min="0"
                    {...field}
                    value={field.value?.toString() || '0'}
                  />
                </FormControl>
                <FormDescription>
                  Montant minimum facturé pour une course avec ce véhicule
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="min_trip_distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance minimale (km)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1" 
                    min="0"
                    {...field}
                    value={field.value?.toString() || '0'}
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
          name="holiday_sunday_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Majoration dimanches et jours fériés (%)</FormLabel>
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
              <FormDescription>
                Pourcentage de majoration pour ce véhicule les dimanches et jours fériés
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

export default VehicleAdditionalOptionsForm;
