
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleDialog from '@/components/vehicles/VehicleDialog';
import EmptyVehicleState from '@/components/vehicles/EmptyVehicleState';
import { useVehicles } from '@/hooks/useVehicles';
import { VehicleFormValues } from '@/components/vehicles/VehicleForm';

const Vehicles = () => {
  const { 
    vehicles, 
    vehicleTypes, 
    loading, 
    typesLoading, 
    submitting, 
    handleSaveVehicle, 
    handleDeleteVehicle,
    getVehicleTypeName
  } = useVehicles();
  
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const getDefaultFormValues = (): VehicleFormValues => {
    if (editingVehicle) {
      return {
        name: editingVehicle.name,
        model: editingVehicle.model,
        capacity: editingVehicle.capacity,
        image_url: editingVehicle.image_url || "",
        is_luxury: editingVehicle.is_luxury,
        is_active: editingVehicle.is_active,
        vehicle_type_id: editingVehicle.vehicle_type_id || "",
        vehicle_type_name: editingVehicle.vehicle_type_name || "",
      };
    }
    
    return {
      name: "",
      model: "",
      capacity: 4,
      image_url: "",
      is_luxury: false,
      is_active: true,
      vehicle_type_id: vehicleTypes.length > 0 ? vehicleTypes[0].id : "",
      vehicle_type_name: "",
    };
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setOpen(true);
  };

  const onSubmit = async (values: VehicleFormValues) => {
    const success = await handleSaveVehicle(values, editingVehicle);
    if (success) {
      setOpen(false);
      setEditingVehicle(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vos véhicules</h1>
            <p className="text-muted-foreground">
              Gérez les véhicules que vous proposez à vos clients
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyVehicleState onAddNew={handleAddNew} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onEdit={handleEdit} 
                onDelete={handleDeleteVehicle} 
              />
            ))}
          </div>
        )}

        <VehicleDialog
          open={open}
          onOpenChange={setOpen}
          title={editingVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
          description="Renseignez les informations de votre véhicule ci-dessous"
          defaultValues={getDefaultFormValues()}
          vehicleTypes={vehicleTypes}
          typesLoading={typesLoading}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
