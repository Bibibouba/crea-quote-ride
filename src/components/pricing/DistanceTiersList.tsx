import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { DistanceTier } from '@/hooks/use-pricing';
import { Vehicle } from '@/types/vehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Ajouter hideVehicleSelector à la liste des props
interface DistanceTiersListProps {
  vehicles: Vehicle[];
  distanceTiers: DistanceTier[];
  selectedVehicleId: string | null;
  onAddTier: () => void;
  onEditTier: (tier: DistanceTier) => void;
  onDeleteTier: (id: string) => void;
  onVehicleSelect: (id: string) => void;
  hideVehicleSelector?: boolean;
}

const DistanceTiersList: React.FC<DistanceTiersListProps> = ({
  vehicles,
  distanceTiers,
  selectedVehicleId,
  onAddTier,
  onEditTier,
  onDeleteTier,
  onVehicleSelect,
  hideVehicleSelector = false
}) => {
  const filteredTiers = distanceTiers.filter(tier => tier.vehicle_id === selectedVehicleId);

  return (
    <div className="space-y-6">
      {!hideVehicleSelector && (
        <div>
          <label className="block text-sm font-medium mb-2">Sélectionnez un véhicule</label>
          <Select value={selectedVehicleId || ''} onValueChange={onVehicleSelect}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Sélectionnez un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} - {vehicle.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Table>
        <TableCaption>Paliers de tarification au kilomètre</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Distance max. (km)</TableHead>
            <TableHead>Prix par km (€)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTiers.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-medium">{tier.max_distance_km}</TableCell>
              <TableCell>{tier.price_per_km}</TableCell>
              <TableCell>
                <Button variant="secondary" size="sm" onClick={() => onEditTier(tier)}>
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDeleteTier(tier.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddTier}>Ajouter un palier</Button>
    </div>
  );
};

export default DistanceTiersList;
