
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import VehicleForm from './VehicleForm';
import { VehicleFormValues, Vehicle } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicle';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<VehicleFormValues>;
  vehicleTypes: VehicleType[];
  onSubmit: (data: VehicleFormValues) => void;
  isSubmitting: boolean;
  title?: string;
  description?: string;
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({ 
  open, 
  onOpenChange, 
  initialValues, 
  vehicleTypes, 
  onSubmit,
  isSubmitting,
  title = initialValues?.id ? "Modifier un véhicule" : "Ajouter un véhicule",
  description = initialValues?.id ? "Modifier les informations du véhicule" : "Ajouter un nouveau véhicule à votre flotte"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <VehicleForm 
          initialValues={initialValues} 
          vehicleTypes={vehicleTypes} 
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
