
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

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
        Le devis a été enregistré et envoyé à l'adresse : {email}
      </p>
      <div className="flex gap-4">
        <Button onClick={navigateToDashboard}>
          Voir tous les devis
        </Button>
        <Button 
          variant="outline" 
          onClick={resetForm}
        >
          Créer un nouveau devis
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessageStep;
