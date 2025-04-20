
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SimulatorAlert = () => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200 text-sm sm:text-base">
      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
      <AlertTitle className="text-blue-800 text-base sm:text-lg">Simulateur de tarification</AlertTitle>
      <AlertDescription className="text-blue-700">
        Ce simulateur vous permet d'obtenir un devis instantané pour votre trajet. 
        Les tarifs affichés incluent toutes les charges, y compris les majorations pour les trajets de nuit 
        et les dimanches/jours fériés le cas échéant.
      </AlertDescription>
    </Alert>
  );
};

export default SimulatorAlert;
