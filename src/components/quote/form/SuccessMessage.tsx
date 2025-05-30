
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuccessMessageProps {
  onCreateNew?: () => void;
  showDashboardLink?: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onCreateNew, showDashboardLink = true }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-green-100 p-3 rounded-full mb-4">
        <CheckIcon className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Devis enregistré avec succès</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Votre devis a bien été enregistré dans notre système et sera accessible depuis votre dashboard.
      </p>
      
      <div className="flex gap-4">
        {showDashboardLink ? (
          <Button asChild>
            <Link to="/dashboard/quotes">
              Voir les devis
            </Link>
          </Button>
        ) : (
          <Button onClick={onCreateNew}>
            Créer un nouveau devis
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
