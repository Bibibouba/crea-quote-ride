
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import VehicleForm from './VehicleForm';
import { Vehicle } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicleType';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  vehicleTypes: VehicleType[];
  title: string;
  description?: string;
  onSave: () => void;
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({ 
  open, 
  onOpenChange, 
  vehicle, 
  vehicleTypes, 
  title,
  description,
  onSave 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <VehicleForm 
          vehicle={vehicle} 
          vehicleTypes={vehicleTypes} 
          onSuccess={onSave} 
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
