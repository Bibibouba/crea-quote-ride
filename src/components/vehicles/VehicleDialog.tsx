import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VehicleForm from './VehicleForm';
import { Vehicle } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicleType';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  vehicleTypes: VehicleType[];
  onSave: () => void;
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({ open, onOpenChange, vehicle, vehicleTypes, onSave }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</DialogTitle>
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
