
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VehicleDialog from '@/components/vehicles/VehicleDialog';
import { useVehicles } from '@/hooks/useVehicles';
import VehicleCard from '@/components/vehicles/VehicleCard';
import EmptyVehicleState from '@/components/vehicles/EmptyVehicleState';
import { Card } from '@/components/ui/card';

// Wrapper component to fix type issues
const TabWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div>{children}</div>
);

const VehiclesPage = () => {
  const { vehicles, isLoading, updateVehicle } = useVehicles();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleActivationChange = async (id: string, isActive: boolean) => {
    try {
      await updateVehicle.mutateAsync({
        id,
        is_active: isActive,
      });
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez votre flotte de véhicules disponibles pour les transferts
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          <span>Ajouter un véhicule</span>
        </Button>
      </div>

      {/* Vehicles List */}
      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Chargement de vos véhicules...
        </Card>
      ) : vehicles.length === 0 ? (
        <EmptyVehicleState onAddClick={() => setShowAddDialog(true)} />
      ) : (
        <TabWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onActivationChange={handleActivationChange}
              />
            ))}
          </div>
        </TabWrapper>
      )}

      {/* Add Vehicle Dialog */}
      <VehicleDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        mode="add"
      />
    </div>
  );
};

export default VehiclesPage;
