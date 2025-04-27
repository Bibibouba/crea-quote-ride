
import React from 'react';
import SimulatorLoading from './SimulatorLoading';
import SimulatorHeader from './steps/SimulatorHeader';
import SimulatorTabs from './SimulatorTabs';
import SimulatorAlert from './SimulatorAlert';
import SuccessState from './SuccessState';
import { useSimulator } from '@/hooks/useSimulator';

interface SimulatorContainerProps {
  isWidget?: boolean;
  companyName?: string;
  logoUrl?: string;
}

const SimulatorContainer: React.FC<SimulatorContainerProps> = ({
  isWidget = false,
  companyName,
  logoUrl
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
  } = useSimulator();

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
            handleSubmit={handleSubmit}
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
