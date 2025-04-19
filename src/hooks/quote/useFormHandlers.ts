
import { FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseFormHandlersProps {
  setShowQuote: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useFormHandlers = ({
  setShowQuote,
  setIsLoading
}: UseFormHandlersProps) => {
  const { toast } = useToast();
  
  const handleSubmit = (
    e: FormEvent,
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
    handleSubmit,
    handleReset
  };
};
