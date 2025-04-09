
import { useState, useEffect } from 'react';
import { supabase, VehicleType } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Vehicle } from '@/types/vehicle';
import { VehicleFormValues } from '@/components/vehicles/VehicleForm';

export const useVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [typesLoading, setTypesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load vehicle types
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
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        toast.error('Erreur lors du chargement des types de véhicules');
      } finally {
        setTypesLoading(false);
      }
    };
    
    fetchVehicleTypes();
  }, [user]);

  // Load vehicles
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setVehicles(data || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Erreur lors du chargement des véhicules');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [user]);

  const getVehicleTypeName = (typeId: string | undefined) => {
    if (!typeId) return "";
    const type = vehicleTypes.find(t => t.id === typeId);
    return type ? type.name : "";
  };

  const handleSaveVehicle = async (values: VehicleFormValues, editingVehicle: Vehicle | null) => {
    if (!user) return;
    
    setSubmitting(true);
    
    // Get vehicle type name from selected ID
    const vehicleTypeName = getVehicleTypeName(values.vehicle_type_id);
    
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const { error } = await supabase
          .from('vehicles')
          .update({
            name: values.name,
            model: values.model,
            capacity: values.capacity,
            image_url: values.image_url,
            is_luxury: values.is_luxury,
            is_active: values.is_active,
            vehicle_type_id: values.vehicle_type_id,
            vehicle_type_name: vehicleTypeName,
          })
          .eq('id', editingVehicle.id);
          
        if (error) throw error;
        
        // Update local state
        setVehicles(vehicles.map(v => 
          v.id === editingVehicle.id ? { 
            ...v, 
            ...values,
            vehicle_type_name: vehicleTypeName
          } : v
        ));
        toast.success('Véhicule mis à jour avec succès');
        return true;
      } else {
        // Create new vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .insert({
            name: values.name,
            model: values.model, 
            capacity: values.capacity,
            image_url: values.image_url,
            is_luxury: values.is_luxury,
            is_active: values.is_active,
            vehicle_type_id: values.vehicle_type_id,
            vehicle_type_name: vehicleTypeName,
            driver_id: user.id
          })
          .select();
          
        if (error) throw error;
        
        // Update local state
        setVehicles([data[0], ...vehicles]);
        toast.success('Véhicule ajouté avec succès');
        return true;
      }
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return false;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Véhicule supprimé avec succès');
      return true;
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    }
  };

  return {
    vehicles,
    vehicleTypes,
    loading,
    typesLoading,
    submitting,
    handleSaveVehicle,
    handleDeleteVehicle,
    getVehicleTypeName
  };
};
