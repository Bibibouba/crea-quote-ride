
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VehicleForm, { VehicleFormValues } from './VehicleForm';
import { Vehicle, VehicleType } from '@/types/vehicle';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  defaultValues: VehicleFormValues;
  vehicleTypes: VehicleType[];
  typesLoading: boolean;
  submitting: boolean;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
}

const VehicleDialog = ({ 
  open,
  onOpenChange,
  title,
  description,
  defaultValues,
  vehicleTypes,
  typesLoading,
  submitting,
  onSubmit
}: VehicleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <VehicleForm 
          defaultValues={defaultValues} 
          vehicleTypes={vehicleTypes}
          typesLoading={typesLoading}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
