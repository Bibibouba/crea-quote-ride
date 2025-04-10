
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export type QuoteFormStep = 'step1' | 'step2' | 'step3';

export function useFormNavigation() {
  const [activeTab, setActiveTab] = useState<QuoteFormStep>('step1');
  const navigate = useNavigate();
  
  const handleNextStep = (validationFn?: () => boolean) => {
    if (validationFn && !validationFn()) {
      return false;
    }
    
    if (activeTab === 'step1') {
      console.log("Moving to step 2 with valid data");
      setActiveTab('step2');
    } else if (activeTab === 'step2') {
      console.log("Moving to step 3");
      setActiveTab('step3');
    }
    
    return true;
  };
  
  const handlePreviousStep = () => {
    if (activeTab === 'step2') {
      setActiveTab('step1');
    } else if (activeTab === 'step3') {
      setActiveTab('step2');
    }
  };
  
  const resetForm = () => {
    setActiveTab('step1');
  };
  
  const navigateToDashboard = (path: string = '/dashboard') => {
    navigate(path);
  };
  
  return {
    activeTab,
    setActiveTab,
    handleNextStep,
    handlePreviousStep,
    resetForm,
    navigateToDashboard,
    navigate
  };
}
