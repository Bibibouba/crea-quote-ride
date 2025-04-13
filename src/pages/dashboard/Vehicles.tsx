
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useVehicles } from '@/hooks/useVehicles';
import VehicleDialog from '@/components/vehicles/VehicleDialog';
import VehicleCard from '@/components/vehicles/VehicleCard';
import EmptyVehicleState from '@/components/vehicles/EmptyVehicleState';
import { PlusCircle } from 'lucide-react';

const VehiclesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const { vehicles, loading, handleDeleteVehicle, handleSaveVehicle } = useVehicles();

  const openAddDialog = () => {
    setEditingVehicle(null);
    setDialogOpen(true);
  };

  const openEditDialog = (vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleActivationChange = async (id, isActive) => {
    // Find the vehicle
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    // Update with new active status
    await handleSaveVehicle({
      ...vehicle,
      is_active: isActive
    }, vehicle);
  };

  if (loading) {
    return <div>Chargement des véhicules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez vos véhicules disponibles pour les courses
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyVehicleState onAddClick={openAddDialog} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => openEditDialog(vehicle)}
              onDelete={() => handleDeleteVehicle(vehicle.id)}
              onActivationChange={(isActive) => handleActivationChange(vehicle.id, isActive)}
            />
          ))}
        </div>
      )}

      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={editingVehicle}
        onSave={handleSaveVehicle}
      />
    </div>
  );
};

export default VehiclesPage;
