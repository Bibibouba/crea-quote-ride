
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

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
        {isSubmitting ? (
          'Enregistrement...'
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer le client
          </>
        )}
      </Button>
    </div>
  );
};

export default ClientFormFooter;
