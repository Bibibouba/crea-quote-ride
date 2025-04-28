
import React from 'react';
import SimulatorLoading from './SimulatorLoading';
import SimulatorHeader from './steps/SimulatorHeader';
import SimulatorTabs from './SimulatorTabs';
import SimulatorAlert from './SimulatorAlert';
import SuccessState from './SuccessState';
import { useSimulator } from '@/hooks/useSimulator';
import { Quote } from '@/types/quote';

interface SimulatorContainerProps {
  isWidget?: boolean;
  companyName?: string;
  logoUrl?: string;
  prefill?: {
    departure?: string;
    destination?: string;
    date?: string;
    time?: string;
    passengers?: string;
    vehicleType?: string;
  };
}

const SimulatorContainer: React.FC<SimulatorContainerProps> = ({
  isWidget = false,
  companyName,
  logoUrl,
  prefill
}) => {
  const {
    simulatorReady,
    isSubmitting,
    isQuoteSent,
    activeTab,
    setActiveTab,
    formState,
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    resetForm,
    navigateToDashboard
  } = useSimulator({ isWidget, prefill });

  // Handler pour gérer la soumission de manière asynchrone
  const handleFormSubmit = async (): Promise<void> => {
    try {
      await handleSubmit();
    } catch (error) {
      console.error("Erreur lors de la soumission du devis:", error);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <SimulatorHeader 
        isWidget={isWidget} 
        companyName={companyName}
        logoUrl={logoUrl}
      />
      
      <div className="mb-4 sm:mb-6">
        <SimulatorAlert />
      </div>
      
      {!simulatorReady ? (
        <SimulatorLoading />
      ) : isQuoteSent ? (
        <SuccessState 
          onReset={resetForm}
          onNavigateDashboard={navigateToDashboard}
          isWidget={isWidget}
        />
      ) : (
        <div className="w-full">
          <SimulatorTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formState={formState}
            isSubmitting={isSubmitting}
            handleSubmit={handleFormSubmit}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            isWidget={isWidget}
          />
        </div>
      )}
    </div>
  );
};

export default SimulatorContainer;
