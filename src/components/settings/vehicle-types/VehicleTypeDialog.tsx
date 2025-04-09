
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VehicleTypeForm, { VehicleTypeFormValues } from './VehicleTypeForm';
import { VehicleType } from '@/types/vehicle';

interface VehicleTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingType: VehicleType | null;
  onSubmit: (values: VehicleTypeFormValues) => Promise<void>;
  saving: boolean;
}

const VehicleTypeDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingType, 
  onSubmit, 
  saving 
}: VehicleTypeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingType ? "Modifier le type de véhicule" : "Ajouter un type de véhicule"}
          </DialogTitle>
          <DialogDescription>
            {editingType 
              ? "Modifiez les informations du type de véhicule ci-dessous" 
              : "Créez un nouveau type de véhicule pour vos devis"}
          </DialogDescription>
        </DialogHeader>
        
        <VehicleTypeForm 
          editingType={editingType} 
          onSubmit={onSubmit} 
          saving={saving} 
        />
        
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleTypeDialog;
