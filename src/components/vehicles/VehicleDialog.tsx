
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import VehicleForm from './VehicleForm';
import { Vehicle } from '@/types/vehicle';

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (values: any, editingVehicle: Vehicle | null) => Promise<void>;
}

const VehicleDialog = ({ open, onOpenChange, vehicle, onSave }: VehicleDialogProps) => {
  const isEditing = !!vehicle;
  const title = isEditing ? 'Modifier le véhicule' : 'Ajouter un véhicule';
  
  const handleSave = async (values: any) => {
    await onSave(values, vehicle);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <VehicleForm defaultValues={vehicle || {}} onSubmit={handleSave} />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
