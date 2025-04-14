
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleDialog from '@/components/vehicles/VehicleDialog';
import EmptyVehicleState from '@/components/vehicles/EmptyVehicleState';
import { PlusIcon, Loader2 } from 'lucide-react';
import { Vehicle, VehicleFormValues } from '@/types/vehicle';

const Vehicles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { vehicles, loading, handleSaveVehicle, handleDeleteVehicle } = useVehicles();
  const { vehicleTypes, loading: typesLoading } = useVehicleTypes();
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewVehicle = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleVehicleSubmit = async (data: VehicleFormValues) => {
    setIsSubmitting(true);
    try {
      await handleSaveVehicle(data, editingVehicle);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting vehicle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await handleDeleteVehicle(id);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez les véhicules que vous proposez à vos clients
          </p>
        </div>
        <Button onClick={handleNewVehicle}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      {loading || typesLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyVehicleState onAddClick={handleNewVehicle} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => handleEditVehicle(vehicle)}
              onDelete={() => handleDeleteClick(vehicle.id)}
            />
          ))}
        </div>
      )}

      <VehicleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValues={editingVehicle || undefined}
        onSubmit={handleVehicleSubmit}
        isSubmitting={isSubmitting}
        vehicleTypes={vehicleTypes}
      />
    </DashboardLayout>
  );
};

export default Vehicles;
