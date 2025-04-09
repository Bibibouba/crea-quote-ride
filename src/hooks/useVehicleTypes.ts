
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VehicleType } from '@/types/vehicle';

export const useVehicleTypes = () => {
  const { user } = useAuth();
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchVehicleTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicle_types')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) throw error;
        setVehicleTypes(data || []);
      } catch (error: any) {
        console.error('Error fetching vehicle types:', error);
        toast.error('Erreur lors du chargement des types de véhicules');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleTypes();
  }, [user]);

  return {
    vehicleTypes,
    setVehicleTypes,
    loading
  };
};
