
import React from 'react';
import { Button } from '@/components/ui/button';

interface TripSummaryActionsProps {
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}

export const TripSummaryActions: React.FC<TripSummaryActionsProps> = ({
  handlePreviousStep,
  handleNextStep
}) => {
  const addDebuggingInfo = () => {
    console.log("Vérification des données de tarification et attente...");
    
    // Vérifie s'il existe des objets dans la page avec des informations sur le temps d'attente
    const waitingTimeInfo = 'waitingTimeInfo' in window ? (window as any).waitingTimeInfo : null;
    if (waitingTimeInfo) {
      console.log("Données de temps d'attente trouvées:", waitingTimeInfo);
    }
    
    // Vérifie les données du devis complet
    const quoteDetails = 'quoteDetails' in window ? (window as any).quoteDetails : null;
    if (quoteDetails) {
      console.log("Données complètes du devis trouvées:", quoteDetails);
      
      // Vérifier spécifiquement les données liées au temps
      console.log("Données temporelles:", {
        waitTimeDay: quoteDetails.waitTimeDay,
        waitTimeNight: quoteDetails.waitTimeNight,
        waitEndTime: quoteDetails.waitEndTime,
        returnStartTime: quoteDetails.returnStartTime,
        returnEndTime: quoteDetails.returnEndTime
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
      <Button 
        variant="outline" 
        onClick={() => {
          addDebuggingInfo();
          handlePreviousStep();
        }} 
        className="w-full sm:w-auto order-1 sm:order-none"
      >
        Retour
      </Button>
      <Button 
        onClick={() => {
          addDebuggingInfo();
          handleNextStep();
        }} 
        className="w-full sm:w-auto order-0 sm:order-none"
      >
        Continuer
      </Button>
    </div>
  );
};
