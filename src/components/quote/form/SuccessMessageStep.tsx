
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, Home, FileText } from 'lucide-react';

interface SuccessMessageStepProps {
  email: string;
  resetForm: () => void;
  navigateToDashboard: () => void;
}

const SuccessMessageStep: React.FC<SuccessMessageStepProps> = ({
  email,
  resetForm,
  navigateToDashboard
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <CheckIcon className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-xl font-medium mb-2">Devis enregistré avec succès</h3>
      <p className="text-muted-foreground mb-6">
        Le devis a été enregistré et envoyé à l'adresse : <span className="font-medium">{email}</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Button onClick={navigateToDashboard} className="w-full flex items-center justify-center gap-2">
          <FileText className="h-4 w-4" />
          Voir tous les devis
        </Button>
        <Button 
          variant="outline" 
          onClick={resetForm}
          className="w-full flex items-center justify-center gap-2"
        >
          <Home className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessageStep;
