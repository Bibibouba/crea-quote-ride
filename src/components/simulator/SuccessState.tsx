
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SuccessStateProps {
  onReset: () => void;
  onNavigateDashboard: () => void;
  isWidget?: boolean;
}

const SuccessState: React.FC<SuccessStateProps> = ({ 
  onReset, 
  onNavigateDashboard,
  isWidget = false 
}) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="space-y-1 sm:space-y-2">
        <CardTitle className="text-green-800 text-lg sm:text-xl">Devis envoyé avec succès</CardTitle>
        <CardDescription className="text-green-700 text-sm sm:text-base">
          Votre demande de devis a été envoyée. Vous recevrez une confirmation par email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-green-700 text-sm sm:text-base">
          Merci d'avoir utilisé notre simulateur de tarification. Notre équipe va traiter votre demande dans les plus brefs délais.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
          Créer un nouveau devis
        </Button>
        {!isWidget && (
          <Button onClick={onNavigateDashboard} className="w-full sm:w-auto">
            Retour à l'accueil
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SuccessState;
