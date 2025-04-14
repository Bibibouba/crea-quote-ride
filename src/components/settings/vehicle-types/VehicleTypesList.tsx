
import React, { useState } from 'react';
import { Pencil, Trash2, CarFront, Check, X, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleType } from '@/types/vehicle';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface VehicleTypesListProps {
  vehicleTypes: VehicleType[];
  setVehicleTypes: React.Dispatch<React.SetStateAction<VehicleType[]>>;
  onEditType: (type: VehicleType) => void;
}

const VehicleTypesList = ({ vehicleTypes, setVehicleTypes, onEditType }: VehicleTypesListProps) => {
  const [editingInPlace, setEditingInPlace] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState("");

  const startEditing = (id: string, name: string) => {
    setEditingInPlace(id);
    setNewTypeName(name);
  };

  const saveInlineEdit = async (id: string) => {
    if (!newTypeName.trim() || newTypeName.length < 3) {
      toast.error('Le nom doit contenir au moins 3 caractères');
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_types')
        .update({ name: newTypeName, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setVehicleTypes(types => 
        types.map(t => t.id === id ? { ...t, name: newTypeName } : t)
      );

      setEditingInPlace(null);
      toast.success('Type de véhicule mis à jour');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const cancelInlineEdit = () => {
    setEditingInPlace(null);
    setNewTypeName("");
  };

  const handleDeleteType = async (id: string) => {
    // Check if this type is being used by any vehicles
    try {
      const { data: vehiclesUsingType, error: checkError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('vehicle_type_id', id)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (vehiclesUsingType && vehiclesUsingType.length > 0) {
        toast.error('Ce type de véhicule est utilisé par un ou plusieurs véhicules. Veuillez d\'abord modifier ces véhicules.');
        return;
      }
      
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce type de véhicule ?')) {
        return;
      }

      // First, delete associated pricing tiers
      const { error: pricingError } = await supabase
        .from('distance_pricing_tiers')
        .delete()
        .eq('vehicle_type_id', id);
        
      if (pricingError) {
        console.error('Erreur lors de la suppression des tarifs:', pricingError);
        // Continue anyway to try deleting the vehicle type
      }

      // Then delete the vehicle type
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicleTypes(types => types.filter(t => t.id !== id));
      toast.success('Type de véhicule supprimé');
      
      // If this was the default type and there are other types, set another one as default
      const wasDefault = vehicleTypes.find(t => t.id === id)?.is_default || false;
      const remainingTypes = vehicleTypes.filter(t => t.id !== id);
      
      if (wasDefault && remainingTypes.length > 0) {
        const newDefaultId = remainingTypes[0].id;
        await setDefaultType(newDefaultId, false); // Silently set a new default
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };
  
  const setDefaultType = async (id: string, showConfirm = true) => {
    if (showConfirm && !window.confirm('Définir ce type comme type par défaut ?')) {
      return;
    }
    
    try {
      // First, remove default status from all types
      const { error: updateError } = await supabase
        .from('vehicle_types')
        .update({ is_default: false })
        .neq('id', 'dummy'); // This will update all rows
        
      if (updateError) throw updateError;
      
      // Then set the selected type as default
      const { error } = await supabase
        .from('vehicle_types')
        .update({ is_default: true })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setVehicleTypes(types => 
        types.map(t => ({ ...t, is_default: t.id === id }))
      );
      
      if (showConfirm) {
        toast.success('Type par défaut mis à jour');
      }
    } catch (error: any) {
      console.error('Erreur lors de la définition du type par défaut:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-3 p-4 font-medium bg-muted">
        <div>Nom</div>
        <div>Type par défaut</div>
        <div></div>
      </div>
      
      {vehicleTypes.map((type) => (
        <div key={type.id} className="grid grid-cols-3 p-4 items-center border-t">
          <div>
            {editingInPlace === type.id ? (
              <div className="flex items-center space-x-2">
                <Input 
                  value={newTypeName} 
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="h-8"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => saveInlineEdit(type.id)}
                  className="h-8 w-8"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={cancelInlineEdit}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CarFront className="h-4 w-4 text-muted-foreground" />
                <span>{type.name}</span>
              </div>
            )}
          </div>
          <div>
            {type.is_default ? (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Par défaut
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">Non</span>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {!type.is_default && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDefaultType(type.id)}
                title="Définir comme type par défaut"
              >
                <Star className="h-4 w-4 text-amber-500" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => startEditing(type.id, type.name)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDeleteType(type.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleTypesList;
