
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DistanceTier } from './use-pricing';

export const useDistanceTiers = () => {
  const { user } = useAuth();
  const [distanceTiers, setDistanceTiers] = useState<DistanceTier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTiers = async () => {
      setLoadingTiers(true);
      try {
        const { data, error } = await supabase
          .from('distance_pricing_tiers')
          .select('*')
          .eq('driver_id', user.id)
          .order('min_km', { ascending: true });
        if (error) throw error;
        setDistanceTiers(data || []);
      } catch (e: any) {
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des paliers de distance.",
          variant: "destructive",
        });
      } finally {
        setLoadingTiers(false);
      }
    };
    fetchTiers();
  }, [user]);
  return { distanceTiers, setDistanceTiers, loadingTiers };
};
