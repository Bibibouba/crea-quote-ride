
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, PlusCircle, Car } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  is_luxury: boolean;
  vehicle_type_name: string;
}

interface DistanceTier {
  id?: string;
  min_km: number;
  max_km: number | null;
  price_per_km: number;
  vehicle_id: string | null;
}

interface DistanceTiersListProps {
  vehicles: Vehicle[];
  distanceTiers: DistanceTier[];
  selectedVehicleId: string | null;
  onAddTier: () => void;
  onEditTier: (tier: DistanceTier) => void;
  onDeleteTier: (id: string) => void;
  onVehicleSelect: (id: string | null) => void;
}

const DistanceTiersList = ({
  vehicles,
  distanceTiers,
  selectedVehicleId,
  onAddTier,
  onEditTier,
  onDeleteTier,
  onVehicleSelect,
}: DistanceTiersListProps) => {
  // Filter tiers by selected vehicle
  const filteredTiers = selectedVehicleId ? 
    distanceTiers.filter(tier => tier.vehicle_id === selectedVehicleId || tier.vehicle_id === null) : 
    distanceTiers;

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-6">
        <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Ajoutez d'abord un véhicule</h3>
        <p className="text-muted-foreground mb-4">
          Vous devez créer au moins un véhicule avant de pouvoir définir vos tarifs.
        </p>
        <Button asChild>
          <a href="/dashboard/vehicles">Ajouter un véhicule</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedVehicleId === null ? "default" : "outline"}
          onClick={() => onVehicleSelect(null)}
        >
          Tous les véhicules
        </Button>
        
        {vehicles.map((vehicle) => (
          <Button
            key={vehicle.id}
            variant={selectedVehicleId === vehicle.id ? "default" : "outline"}
            onClick={() => onVehicleSelect(vehicle.id)}
          >
            <Car className="mr-2 h-4 w-4" />
            {vehicle.name}
          </Button>
        ))}
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-4 p-4 font-medium bg-muted">
          <div>De (km)</div>
          <div>À (km)</div>
          <div>Prix par km</div>
          <div></div>
        </div>
        <Separator />
        
        {filteredTiers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Aucun palier de tarification défini{selectedVehicleId ? " pour ce véhicule" : ""}.
            </p>
          </div>
        ) : (
          filteredTiers
            .sort((a, b) => a.min_km - b.min_km)
            .map((tier) => (
              <div key={tier.id} className="grid grid-cols-4 p-4 items-center">
                <div>{tier.min_km} km</div>
                <div>{tier.max_km ? `${tier.max_km} km` : 'Illimité'}</div>
                <div>{tier.price_per_km.toFixed(2)} €/km</div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditTier(tier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => tier.id && onDeleteTier(tier.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
        )}
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={onAddTier}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un palier
        </Button>
      </div>
    </>
  );
};

export default DistanceTiersList;
