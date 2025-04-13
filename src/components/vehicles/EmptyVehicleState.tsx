
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

interface EmptyVehicleStateProps {
  onAddClick: () => void;
}

const EmptyVehicleState = ({ onAddClick }: EmptyVehicleStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-background/50 min-h-[300px]">
      <Car className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
      <h3 className="text-lg font-medium mb-2">Aucun véhicule</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Vous n'avez pas encore ajouté de véhicule à votre flotte. Commencez par ajouter votre premier véhicule.
      </p>
      <Button onClick={onAddClick}>
        Ajouter un véhicule
      </Button>
    </div>
  );
};

export default EmptyVehicleState;
