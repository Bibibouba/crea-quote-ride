
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFormState = () => {
  const { toast } = useToast();
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (
    e: React.FormEvent,
    departureCoordinates?: [number, number], 
    destinationCoordinates?: [number, number]
  ) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (departureCoordinates && destinationCoordinates) {
      setTimeout(() => {
        setShowQuote(true);
        setIsLoading(false);
      }, 500);
    } else {
      toast({
        title: 'Adresses incomplètes',
        description: 'Veuillez sélectionner des adresses valides pour le départ et la destination',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setShowQuote(false);
  };
  
  return {
    showQuote,
    setShowQuote,
    isLoading,
    setIsLoading,
    handleSubmit,
    handleReset
  };
};
