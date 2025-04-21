
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PricingSettings } from './use-pricing';

export const usePricingSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchPricing = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: pricingError } = await supabase
          .from('pricing')
          .select('*')
          .eq('driver_id', user.id)
          .limit(1);

        if (pricingError) throw pricingError;
        if (data && data.length > 0) {
          setPricingSettings(data[0]);
        } else {
          setError("Aucune donnée de tarification trouvée. Veuillez actualiser la page.");
          toast({
            title: "Données manquantes",
            description: "Aucune donnée de tarification trouvée. Veuillez actualiser la page.",
            variant: "destructive",
          });
        }
      } catch (e: any) {
        setError(e.message || "Erreur de chargement des données");
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données de tarification.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [user]);
  return { loading, pricingSettings, setPricingSettings, error, setError };
};
