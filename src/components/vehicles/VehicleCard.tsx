
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleCard = ({ vehicle, onEdit, onDelete }: VehicleCardProps) => {
  return (
    <Card key={vehicle.id} className={!vehicle.is_active ? "opacity-60" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{vehicle.name}</CardTitle>
          {!vehicle.is_active && (
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
              Inactif
            </span>
          )}
        </div>
        <CardDescription>{vehicle.model}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {vehicle.vehicle_type_name && (
            <div className="flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs">
              <span>{vehicle.vehicle_type_name}</span>
            </div>
          )}
          <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
            <span>{vehicle.capacity} passagers</span>
          </div>
          {vehicle.is_luxury && (
            <div className="flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs">
              <span>Premium</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(vehicle.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
