
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleDialog from '@/components/vehicles/VehicleDialog';
import EmptyVehicleState from '@/components/vehicles/EmptyVehicleState';
import { Vehicle } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';

const VehiclesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { vehicles, isLoading, error, addVehicle, updateVehicle } = useVehicles();
  const { toast } = useToast();

  const handleAddClick = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleSaveVehicle = async (values: any, editingVehicle: Vehicle | null) => {
    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({
          id: editingVehicle.id,
          ...values
        });
        toast({
          title: "Véhicule mis à jour",
          description: `Le véhicule ${values.name} a été mis à jour avec succès.`,
        });
      } else {
        await addVehicle.mutateAsync(values);
        toast({
          title: "Véhicule ajouté",
          description: `Le véhicule ${values.name} a été ajouté avec succès.`,
        });
      }
      return true;
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'enregistrement du véhicule: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement des véhicules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Erreur: {error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez votre flotte de véhicules disponibles pour les transferts
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyVehicleState onAddClick={handleAddClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onEditClick={() => handleEditClick(vehicle)} 
            />
          ))}
        </div>
      )}

      <VehicleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
      />
    </div>
  );
};

export default VehiclesPage;
