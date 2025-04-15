
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchVehicles } from '@/utils/vehicleUtils';
import { Vehicle } from '@/types/quoteForm';
import { VehicleType } from '@/types/vehicle'; // Updated import
import { useToast } from '@/hooks/use-toast';

export const useVehicleData = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  
  const setVehiclesWithPricing = useCallback((loadedVehicles: Vehicle[], vehicleId?: string) => {
    setVehicles(loadedVehicles);
    if (vehicleId) {
      setSelectedVehicle(vehicleId);
    } else if (loadedVehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(loadedVehicles[0].id);
    }
  }, [selectedVehicle]);
  
  useEffect(() => {
    const loadVehicleData = async () => {
      setIsLoadingVehicles(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const driverId = session?.user?.id;
        
        if (!driverId) {
          console.log('No authenticated driver found');
          setIsLoadingVehicles(false);
          return;
        }
        
        const { data: types, error: typesError } = await supabase
          .from('vehicle_types')
          .select('*')
          .eq('driver_id', driverId);
          
        if (typesError) throw typesError;
        
        setVehicleTypes(types || []);
        
        await fetchVehicles(driverId, types || [], selectedVehicle, setVehiclesWithPricing);
      } catch (error) {
        console.error('Error loading vehicle data:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les véhicules',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingVehicles(false);
      }
    };
    
    loadVehicleData();
  }, [toast, selectedVehicle, setVehiclesWithPricing]);
  
  return {
    vehicles,
    vehicleTypes,
    isLoadingVehicles,
    selectedVehicle,
    setSelectedVehicle
  };
};
