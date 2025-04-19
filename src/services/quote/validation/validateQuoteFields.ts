
import { toast } from '@/hooks/use-toast';

interface ValidationFields {
  date: Date;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress?: string;
}

export const validateQuoteFields = ({
  date,
  departureCoordinates,
  destinationCoordinates,
  hasReturnTrip,
  returnToSameAddress,
  customReturnAddress,
}: ValidationFields): boolean => {
  if (!date) {
    toast({
      title: 'Date manquante',
      description: 'Veuillez sélectionner une date pour le trajet',
      variant: 'destructive'
    });
    return false;
  }
  
  if (!departureCoordinates || !destinationCoordinates) {
    toast({
      title: 'Adresses incomplètes',
      description: 'Veuillez sélectionner des adresses valides pour le calcul du trajet',
      variant: 'destructive'
    });
    return false;
  }
  
  if (hasReturnTrip && !returnToSameAddress && !customReturnAddress) {
    toast({
      title: 'Adresse de retour manquante',
      description: 'Veuillez spécifier une adresse de retour',
      variant: 'destructive'
    });
    return false;
  }
  
  return true;
};
