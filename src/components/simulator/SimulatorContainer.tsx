
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuoteStateContainer from '@/components/quote/form/QuoteStateContainer';
import { useClientSimulator } from '@/hooks/useClientSimulator';
import SimulatorLoading from './SimulatorLoading';
import SimulatorHeader from './steps/SimulatorHeader';
import SimulatorTabs from './SimulatorTabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const SimulatorContainer = () => {
  const { isSubmitting, isQuoteSent, submitQuote, resetForm, navigateToDashboard } = useClientSimulator();
  const [simulatorReady, setSimulatorReady] = useState(true);

  // Simulate loading for a more engaging experience
  React.useEffect(() => {
    setSimulatorReady(false);
    const timeout = setTimeout(() => {
      setSimulatorReady(true);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <SimulatorHeader />
      
      <div className="mb-6">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Simulateur de tarification</AlertTitle>
          <AlertDescription className="text-blue-700">
            Ce simulateur vous permet d'obtenir un devis instantané pour votre trajet. 
            Les tarifs affichés incluent toutes les charges, y compris les majorations pour les trajets de nuit 
            et les dimanches/jours fériés le cas échéant.
          </AlertDescription>
        </Alert>
      </div>
      
      {!simulatorReady ? (
        <SimulatorLoading />
      ) : isQuoteSent ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Devis envoyé avec succès</CardTitle>
            <CardDescription className="text-green-700">
              Votre demande de devis a été envoyée. Vous recevrez une confirmation par email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700">
              Merci d'avoir utilisé notre simulateur de tarification. Notre équipe va traiter votre demande dans les plus brefs délais.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">
              Créer un nouveau devis
            </Button>
            <Button onClick={navigateToDashboard} className="w-full sm:w-auto">
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <SimulatorTabs>
            <QuoteStateContainer 
              showDashboardLink={false}
              onSuccess={() => {
                // Function that will be called when the quote is successfully submitted
                // This is handled by the useClientSimulator hook
              }}
            />
          </SimulatorTabs>
        </div>
      )}
    </div>
  );
};

export default SimulatorContainer;
