
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}

export const FormNavigation = ({ handlePreviousStep, handleNextStep }: FormNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
      <Button variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto order-1 sm:order-none">
        Retour
      </Button>
      <Button onClick={handleNextStep} className="w-full sm:w-auto order-0 sm:order-none">
        Continuer
      </Button>
    </div>
  );
};
