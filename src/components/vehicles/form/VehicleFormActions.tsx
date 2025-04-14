
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Trash2 } from 'lucide-react';

type VehicleFormActionsProps = {
  isSubmitting: boolean;
  onDeleteClick?: () => void;
};

const VehicleFormActions: React.FC<VehicleFormActionsProps> = ({ 
  isSubmitting, 
  onDeleteClick 
}) => {
  return (
    <div className="flex justify-between">
      {onDeleteClick && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDeleteClick}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </Button>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={`ml-auto flex items-center gap-1 ${!onDeleteClick ? 'ml-auto' : ''}`}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Enregistrer
      </Button>
    </div>
  );
};

export default VehicleFormActions;
