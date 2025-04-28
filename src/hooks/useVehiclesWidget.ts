
// Fichier vide pour le hook useVehiclesWidget
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VehicleWidget {
  id: string;
  name: string;
  model: string;
  capacity: number;
  image_url: string;
  is_luxury: boolean;
}

export const useVehiclesWidget = (driverId: string | undefined) => {
  const [vehicles, setVehicles] = useState<VehicleWidget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!driverId) {
        setLoading(false);
        setVehicles([]);
        return;
      }

      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id,
          name,
          model,
          capacity,
          image_url,
          is_luxury
        `)
        .eq('driver_id', driverId)
        .eq('is_active', true);

      if (error) {
        console.error('Erreur chargement véhicules widget:', error);
        setError('Impossible de charger les véhicules');
      } else {
        setVehicles(data || []);
      }

      setLoading(false);
    };

    fetchVehicles();
  }, [driverId]);

  return { vehicles, loading, error };
};

