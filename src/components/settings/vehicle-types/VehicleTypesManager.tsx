
import React, { useState } from 'react';
import { PlusCircle, Loader2, Car } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';
import VehicleTypesList from './VehicleTypesList';
import VehicleTypeDialog from './VehicleTypeDialog';
import { VehicleTypeFormValues } from './VehicleTypeForm';
import { VehicleType } from '@/types/vehicle';
import { useAuth } from '@/contexts/AuthContext';

const VehicleTypesManager = () => {
  const { vehicleTypes, setVehicleTypes, loading } = useVehicleTypes();
  const [editingType, setEditingType] = useState<VehicleType | null>(null);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Fonction pour ajouter un tarif au kilomètre par défaut pour un type de véhicule
  const createDefaultPricingTier = async (vehicleTypeId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('distance_pricing_tiers')
        .insert({
          driver_id: user.id,
          vehicle_type_id: vehicleTypeId,
          min_km: 0, // Commence à 0 km
          max_km: null, // Pas de limite maximale
          price_per_km: 1.75, // Tarif par défaut
        });

      if (error) throw error;
      
      console.log('Tarif par défaut créé pour le nouveau type de véhicule');
    } catch (error: any) {
      console.error('Erreur lors de la création du tarif par défaut:', error);
    }
  };

  const handleVehicleTypeSubmit = async (values: VehicleTypeFormValues) => {
    if (!user) {
      toast.error('Vous devez être connecté pour effectuer cette action');
      return;
    }
    
    setSaving(true);
    try {
      if (editingType) {
        const { error } = await supabase
          .from('vehicle_types')
          .update({
            name: values.name,
            icon: values.icon || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingType.id);

        if (error) throw error;
        
        setVehicleTypes(types => 
          types.map(t => t.id === editingType.id ? { ...t, name: values.name, icon: values.icon || null } : t)
        );
        
        toast.success('Type de véhicule mis à jour');
      } else {
        const { data, error } = await supabase
          .from('vehicle_types')
          .insert({
            name: values.name,
            icon: values.icon || null,
            is_default: vehicleTypes.length === 0, // Le premier type ajouté devient le type par défaut
            driver_id: user.id,
            default_rate_per_km: 1.75, // Valeur par défaut pour le tarif au km
          })
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          const newVehicleType = data[0] as VehicleType;
          setVehicleTypes(prev => [...prev, newVehicleType]);
          
          // Créer automatiquement un tarif par défaut pour ce type de véhicule
          await createDefaultPricingTier(newVehicleType.id);
        }
        
        toast.success('Type de véhicule ajouté');
        toast.info('Un tarif par défaut a été créé pour ce type de véhicule. Vous pouvez le personnaliser dans les paramètres de tarification.');
      }
      
      setIsTypeDialogOpen(false);
      setEditingType(null);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du type de véhicule:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openAddDialog = () => {
    setEditingType(null);
    setIsTypeDialogOpen(true);
  };

  const openEditDialog = (type: VehicleType) => {
    setEditingType(type);
    setIsTypeDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Types de véhicules</CardTitle>
          <CardDescription>
            Gérez les différents types de véhicules que vous proposez
          </CardDescription>
        </div>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un type
        </Button>
      </CardHeader>
      <CardContent>
        {vehicleTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-muted/10 rounded-md border border-dashed">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun type de véhicule défini</h3>
            <p className="text-muted-foreground text-center mb-6">
              Ajoutez des types de véhicules pour organiser votre flotte et personnaliser vos tarifs
            </p>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer mon premier type de véhicule
            </Button>
          </div>
        ) : (
          <VehicleTypesList 
            vehicleTypes={vehicleTypes} 
            setVehicleTypes={setVehicleTypes} 
            onEditType={openEditDialog} 
          />
        )}
      </CardContent>

      <VehicleTypeDialog 
        isOpen={isTypeDialogOpen}
        onOpenChange={setIsTypeDialogOpen}
        editingType={editingType}
        onSubmit={handleVehicleTypeSubmit}
        saving={saving}
      />
    </Card>
  );
};

export default VehicleTypesManager;
