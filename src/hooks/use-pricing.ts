
import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [distanceTiers, setDistanceTiers] = useState<DistanceTier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching pricing data for user:", user.id);
        
        const { data: pricingData, error: pricingError } = await supabase
          .from('pricing')
          .select('*')
          .eq('driver_id', user.id)
          .limit(1);
          
        if (pricingError) throw pricingError;
        
        console.log("Pricing data received:", pricingData);
        
        if (pricingData && pricingData.length > 0) {
          setPricingSettings(pricingData[0] as PricingSettings);
          console.log("Pricing settings updated:", pricingData[0]);
        } else {
          console.warn("No pricing data found for user:", user.id);
          setError("Aucune donnée de tarification trouvée. Veuillez actualiser la page.");
          toast({
            title: "Données manquantes",
            description: "Aucune donnée de tarification trouvée. Veuillez actualiser la page.",
            variant: "destructive",
          });
        }
        
        const { data: tiersData, error: tiersError } = await supabase
          .from('distance_pricing_tiers')
          .select('*')
          .eq('driver_id', user.id)
          .order('min_km', { ascending: true });
          
        if (tiersError) throw tiersError;
        
        console.log("Distance tiers data received:", tiersData);
        setDistanceTiers(tiersData as DistanceTier[] || []);
        
      } catch (error: any) {
        console.error('Error fetching pricing data:', error);
        setError(error.message || "Erreur de chargement des données");
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données de tarification.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
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
      console.log("Saving pricing settings:", formValues);
      
      const { error } = await supabase
        .from('pricing')
        .update(formValues)
        .eq('id', pricingSettings.id);
        
      if (error) throw error;
      
      setPricingSettings({ ...pricingSettings, ...formValues });
      console.log("Settings updated successfully");
      
      toast({
        title: "Succès",
        description: "Paramètres de tarification enregistrés avec succès.",
      });
    } catch (error: any) {
      console.error('Error saving pricing settings:', error);
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
      console.log("Saving distance tier:", tier, "isNew:", isNew);
      
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
      console.error('Error saving distance tier:', error);
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
      console.log("Deleting tier with id:", id);
      
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
      console.error('Error deleting distance tier:', error);
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const refreshData = async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: pricingData, error: pricingError } = await supabase
        .from('pricing')
        .select('*')
        .eq('driver_id', user.id)
        .limit(1);
        
      if (pricingError) throw pricingError;
      
      if (pricingData && pricingData.length > 0) {
        setPricingSettings(pricingData[0] as PricingSettings);
      }
      
      toast({
        title: "Succès",
        description: "Données actualisées avec succès.",
      });
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'actualisation: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    savingSettings,
    pricingSettings,
    distanceTiers,
    error,
    saveSettings,
    saveTier,
    deleteTier,
    refreshData,
    setSavingSettings
  };
};
