
import { useState } from 'react';
import { usePricingSettings } from './usePricingSettings';
import { useDistanceTiers } from './useDistanceTiers';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PricingSettings {
  id: string;
  base_fare: number;
  price_per_km: number;
  waiting_fee_per_minute: number;
  min_fare: number;
  night_rate_enabled: boolean | null;
  night_rate_start: string | null;
  night_rate_end: string | null;
  night_rate_percentage: number | null;
  wait_price_per_15min: number | null;
  wait_night_enabled: boolean | null;
  wait_night_start: string | null;
  wait_night_end: string | null;
  wait_night_percentage: number | null;
  minimum_trip_fare: number | null;
  holiday_sunday_percentage: number | null;
  minimum_trip_minutes: number | null;
  service_area: string | null;
}

export interface DistanceTier {
  id?: string;
  min_km: number;
  max_km: number | null;
  price_per_km: number;
  vehicle_id: string | null;
}

export const usePricing = () => {
  const { user } = useAuth();
  const {
    loading,
    pricingSettings,
    setPricingSettings,
    error,
    setError
  } = usePricingSettings();
  const {
    distanceTiers,
    setDistanceTiers,
    loadingTiers
  } = useDistanceTiers();

  const [savingSettings, setSavingSettings] = useState(false);

  const saveSettings = async (formValues: Partial<PricingSettings>): Promise<void> => {
    if (!user || !pricingSettings) {
      toast({
        title: "Erreur",
        description: "Aucune donnée de tarification à mettre à jour.",
        variant: "destructive",
      });
      return;
    }

    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('pricing')
        .update(formValues)
        .eq('id', pricingSettings.id);

      if (error) throw error;
      setPricingSettings({ ...pricingSettings, ...formValues });
      toast({
        title: "Succès",
        description: "Paramètres de tarification enregistrés avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const saveTier = async (tier: DistanceTier, isNew: boolean = false): Promise<void> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action.",
        variant: "destructive",
      });
      return;
    }

    setSavingSettings(true);
    try {
      if (!isNew && tier.id) {
        const { error } = await supabase
          .from('distance_pricing_tiers')
          .update({
            min_km: tier.min_km,
            max_km: tier.max_km,
            price_per_km: tier.price_per_km,
            vehicle_id: tier.vehicle_id,
          })
          .eq('id', tier.id);

        if (error) throw error;

        setDistanceTiers(prevTiers =>
          prevTiers.map(t => t.id === tier.id ? tier : t)
        );
        toast({
          title: "Succès",
          description: "Palier de tarification mis à jour."
        });
      } else {
        const { data, error } = await supabase
          .from('distance_pricing_tiers')
          .insert({
            driver_id: user.id,
            min_km: tier.min_km,
            max_km: tier.max_km,
            price_per_km: tier.price_per_km,
            vehicle_id: tier.vehicle_id,
          })
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setDistanceTiers(prevTiers => [...prevTiers, data[0] as DistanceTier]);
        }

        toast({
          title: "Succès",
          description: "Nouveau palier de tarification ajouté."
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const deleteTier = async (id: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('distance_pricing_tiers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDistanceTiers(prevTiers => prevTiers.filter(t => t.id !== id));
      toast({
        title: "Succès",
        description: "Palier de tarification supprimé."
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const refreshData = async (): Promise<void> => {
    // Pour garder la logique DRY, relancer l'effet dans les sub-hooks va suffire
    window.location.reload();
  };

  const loadVehiclePricingSettings = async (vehicleId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('vehicle_pricing_settings')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  };

  return {
    loading: loading || loadingTiers,
    savingSettings,
    pricingSettings,
    distanceTiers,
    error,
    saveSettings,
    saveTier,
    deleteTier,
    refreshData,
    setSavingSettings,
    loadVehiclePricingSettings
  };
};
