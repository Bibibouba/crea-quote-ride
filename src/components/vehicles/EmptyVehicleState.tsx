
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export interface EmptyVehicleStateProps {
  onAddClick: () => void;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border border-dashed">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PlusIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Aucun véhicule</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Vous n'avez pas encore ajouté de véhicule. Commencez par ajouter votre premier véhicule.
      </p>
      <Button onClick={onAddClick} className="mt-4">
        <PlusIcon className="mr-2 h-4 w-4" />
        Ajouter un véhicule
      </Button>
    </div>
  );
};

export default EmptyVehicleState;
