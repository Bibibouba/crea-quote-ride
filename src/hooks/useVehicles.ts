
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, VehicleFormValues } from '@/types/vehicle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VehiclePricingSettings } from '@/types/vehiclePricing';

export const useVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load vehicles
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        console.log('Fetched vehicles:', data);
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
    const type = vehicles.find(t => t.id === typeId);
    return type ? type.name : "";
  };

  const handleSaveVehicle = async (values: VehicleFormValues, editingVehicle: Partial<Vehicle> | null) => {
    if (!user) {
      toast.error('Vous devez être connecté pour enregistrer un véhicule');
      return false;
    }
    
    setSubmitting(true);
    console.log('Saving vehicle with values:', values);
    console.log('Editing vehicle:', editingVehicle);
    
    try {
      // Extraire les données de tarification
      const pricingData: Partial<VehiclePricingSettings> = {
        min_trip_distance: values.min_trip_distance,
        night_rate_enabled: values.night_rate_enabled,
        night_rate_start: values.night_rate_start,
        night_rate_end: values.night_rate_end,
        night_rate_percentage: values.night_rate_percentage,
        wait_price_per_15min: values.wait_price_per_15min,
        wait_night_enabled: values.wait_night_enabled,
        wait_night_start: values.wait_night_start,
        wait_night_end: values.wait_night_end,
        wait_night_percentage: values.wait_night_percentage,
        minimum_trip_fare: values.minimum_trip_fare,
        holiday_sunday_percentage: values.holiday_sunday_percentage,
      };
      
      // Extraire les données du véhicule (sans les données de tarification)
      const vehicleData = {
        name: values.name,
        model: values.model,
        capacity: values.capacity,
        image_url: values.image_url,
        is_luxury: values.is_luxury,
        is_active: values.is_active,
        vehicle_type_id: values.vehicle_type_id,
        vehicle_type_name: values.vehicle_type_name,
      };
      
      if (editingVehicle?.id) {
        // Update existing vehicle
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .update({
            ...vehicleData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingVehicle.id);
          
        if (vehicleError) throw vehicleError;
        
        // Update vehicle pricing settings
        const { error: pricingError } = await supabase
          .from('vehicle_pricing_settings')
          .update(pricingData)
          .eq('vehicle_id', editingVehicle.id);
        
        if (pricingError) throw pricingError;
        
        // Update local state
        setVehicles(vehicles.map(v => 
          v.id === editingVehicle.id ? { 
            ...v, 
            ...vehicleData,
            updated_at: new Date().toISOString()
          } : v
        ));
        toast.success('Véhicule mis à jour avec succès');
        return true;
      } else {
        // Create new vehicle
        const { data, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            ...vehicleData,
            driver_id: user.id
          })
          .select();
          
        if (vehicleError) throw vehicleError;
        
        console.log('New vehicle created:', data);
        
        // Create vehicle pricing settings if needed
        if (data && data.length > 0) {
          const newVehicleId = data[0].id;
          
          // La création des paramètres de tarification est gérée par un trigger,
          // mais nous mettons à jour les valeurs soumises
          const { error: pricingError } = await supabase
            .from('vehicle_pricing_settings')
            .update({
              ...pricingData,
              driver_id: user.id
            })
            .eq('vehicle_id', newVehicleId);
            
          if (pricingError) throw pricingError;
          
          // Update local state
          setVehicles([data[0], ...vehicles]);
          toast.success('Véhicule ajouté avec succès');
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast.error(`Erreur: ${error.message}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer un véhicule');
      return false;
    }
    
    try {
      // Les paramètres de tarification seront supprimés automatiquement grâce à ON DELETE CASCADE
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('driver_id', user.id);
        
      if (error) throw error;
      
      // Mise à jour de l'état local
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
    loading,
    submitting,
    handleSaveVehicle,
    handleDeleteVehicle
  };
};
