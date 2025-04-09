
import React from 'react';
import { Button } from '@/components/ui/button';

interface ClientFormFooterProps {
  onCancel?: () => void;
  isSubmitting: boolean;
}

const ClientFormFooter: React.FC<ClientFormFooterProps> = ({ 
  onCancel, 
  isSubmitting 
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer le client'}
      </Button>
    </div>
  );
};

export default ClientFormFooter;
