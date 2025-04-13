
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => Promise<boolean>;
  onActivationChange: (isActive: boolean) => Promise<void>;
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onActivationChange }: VehicleCardProps) => {
  const handleActivationChange = async (isActive: boolean) => {
    await onActivationChange(isActive);
  };

  return (
    <Card className={`overflow-hidden transition-opacity ${!vehicle.is_active ? 'opacity-60' : ''}`}>
      <div className="aspect-video relative">
        {vehicle.image_url ? (
          <img 
            src={vehicle.image_url} 
            alt={vehicle.name} 
            className="object-cover w-full h-full" 
          />
        ) : (
          <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
            <span className="text-muted-foreground">Aucune image</span>
          </div>
        )}
        {vehicle.is_luxury && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Premium
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{vehicle.name}</h3>
            <p className="text-muted-foreground text-sm">{vehicle.model}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={vehicle.is_active} 
              onCheckedChange={handleActivationChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Type</span>
              <span>{vehicle.vehicle_type_name || 'Standard'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Capacité</span>
              <span>{vehicle.capacity} passagers</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
