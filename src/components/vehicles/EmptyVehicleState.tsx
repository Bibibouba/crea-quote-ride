
import React from 'react';
import { Car, PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyVehicleStateProps {
  onAddNew: () => void;
}

const EmptyVehicleState = ({ onAddNew }: EmptyVehicleStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Car className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold">Aucun véhicule</h3>
        <p className="mb-6 text-center text-muted-foreground">
          Vous n'avez pas encore ajouté de véhicule à votre flotte.
        </p>
        <Button onClick={onAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter votre premier véhicule
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyVehicleState;
