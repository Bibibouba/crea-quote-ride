
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { VehicleType } from '@/types/vehicleType';
import { toast } from 'sonner';

export const useVehicleTypes = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Charger les types de véhicules
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicleTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicle_types')
          .select('*')
          .eq('driver_id', user.id);
          
        if (error) throw error;
        console.log('Fetched vehicle types:', data);
        setVehicleTypes(data || []);
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        toast.error('Erreur lors du chargement des types de véhicules');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleTypes();
  }, [user]);

  const addVehicleType = async (vehicleType: Partial<VehicleType>) => {
    if (!user) return null;
    
    try {
      // Assurez-vous que default_rate_per_km est inclus
      const dataToInsert = {
        name: vehicleType.name || '',
        icon: vehicleType.icon || '',
        is_default: vehicleType.is_default || false,
        driver_id: user.id,
        default_rate_per_km: vehicleType.default_rate_per_km || 0 // S'assure que la valeur est présente
      };
      
      const { data, error } = await supabase
        .from('vehicle_types')
        .insert(dataToInsert)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        setVehicleTypes([...vehicleTypes, data[0]]);
        return data[0];
      }
      return null;
    } catch (error: any) {
      console.error('Error adding vehicle type:', error);
      toast.error(`Erreur: ${error.message}`);
      return null;
    }
  };

  const updateVehicleType = async (id: string, vehicleType: Partial<VehicleType>) => {
    if (!user) return false;
    
    try {
      // Assurez-vous que default_rate_per_km est inclus
      const dataToUpdate = {
        ...vehicleType,
        default_rate_per_km: vehicleType.default_rate_per_km || 0 // S'assure que la valeur est présente
      };
      
      const { error } = await supabase
        .from('vehicle_types')
        .update(dataToUpdate)
        .eq('id', id)
        .eq('driver_id', user.id);
        
      if (error) throw error;
      
      setVehicleTypes(
        vehicleTypes.map((vt) =>
          vt.id === id ? { ...vt, ...vehicleType } : vt
        )
      );
      return true;
    } catch (error: any) {
      console.error('Error updating vehicle type:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    }
  };

  const deleteVehicleType = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id)
        .eq('driver_id', user.id);
        
      if (error) throw error;
      
      setVehicleTypes(vehicleTypes.filter((vt) => vt.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting vehicle type:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    }
  };

  return {
    vehicleTypes,
    loading,
    addVehicleType,
    updateVehicleType,
    deleteVehicleType,
  };
};
