
import React, { useState } from 'react';
import { Pencil, Trash2, CarFront, Check, X } from 'lucide-react';
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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce type de véhicule ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicleTypes(types => types.filter(t => t.id !== id));
      toast.success('Type de véhicule supprimé');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
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
      
      {vehicleTypes.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Aucun type de véhicule défini</p>
        </div>
      ) : (
        vehicleTypes.map((type) => (
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
                <>
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
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VehicleTypesList;
