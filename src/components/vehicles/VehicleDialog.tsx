
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import VehicleForm from './VehicleForm';
import { VehicleFormValues, Vehicle } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Vehicle>;
  vehicleTypes: VehicleType[];
  onSubmit: (data: VehicleFormValues) => void;
  isSubmitting: boolean;
  title?: string;
  description?: string;
  onDelete?: (id: string) => void;
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({ 
  open, 
  onOpenChange, 
  initialValues, 
  vehicleTypes, 
  onSubmit,
  isSubmitting,
  title = initialValues?.id ? "Modifier un véhicule" : "Ajouter un véhicule",
  description = initialValues?.id ? "Modifier les informations du véhicule" : "Ajouter un nouveau véhicule à votre flotte",
  onDelete
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const handleDelete = () => {
    if (initialValues?.id && onDelete) {
      onDelete(initialValues.id);
      setIsDeleteConfirmOpen(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <VehicleForm 
            initialValues={initialValues} 
            vehicleTypes={vehicleTypes} 
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onDeleteClick={initialValues?.id && onDelete ? () => setIsDeleteConfirmOpen(true) : undefined}
          />
        </DialogContent>
      </Dialog>

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
              Le véhicule <span className="font-bold">{initialValues?.name} {initialValues?.model}</span> sera définitivement supprimé.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Les devis associés à ce véhicule ne seront pas supprimés, mais la référence à ce véhicule sera retirée.
            </p>
          </div>
          <SheetFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer définitivement
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VehicleDialog;
