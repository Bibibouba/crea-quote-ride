
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { AlertTriangle } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

const VehicleCard = ({ vehicle, onEdit, onDelete }: VehicleCardProps) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(vehicle.id);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <Card key={vehicle.id} className={`h-full flex flex-col ${!vehicle.is_active ? "opacity-60" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="truncate">{vehicle.name}</CardTitle>
            {!vehicle.is_active && (
              <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                Inactif
              </span>
            )}
          </div>
          <CardDescription className="truncate">{vehicle.model}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mt-1">
            {vehicle.vehicle_type_name && (
              <div className="flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs">
                <span className="truncate">{vehicle.vehicle_type_name}</span>
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
        <CardFooter className="border-t pt-4 mt-auto">
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Confirmation de suppression */}
      <Sheet open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </SheetTitle>
            <SheetDescription>
              Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?
              Cette action est irréversible et supprimera également toutes les données associées à ce véhicule.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <p className="text-sm font-medium">
              Le véhicule <span className="font-bold">{vehicle.name} {vehicle.model}</span> sera définitivement supprimé.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Les devis associés à ce véhicule ne seront pas supprimés, mais la référence à ce véhicule sera retirée.
            </p>
          </div>
          <SheetFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Supprimer définitivement
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VehicleCard;
