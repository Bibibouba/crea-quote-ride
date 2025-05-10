
import { useToast } from '@/hooks/use-toast';
import { Quote } from '@/types/quote';
import { QuoteDetailsType } from '@/types/quoteForm';
import { prepareQuoteData } from '../utils/prepareQuoteData';
import { validateQuoteData } from '../utils/validateQuoteData';
import { createQuoteInDb } from '../utils/quoteDbAdapter';
import { quotesLogger } from '../utils/quotesLogger';

interface CreateQuoteProps {
  driverId: string;
  clientId: string;
  selectedVehicle: string;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number];
  destinationCoordinates: [number, number];
  dateTime: Date;
  estimatedDistance: number;
  estimatedDuration: number;
  quoteDetails: QuoteDetailsType;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  returnDistance: number;
  returnDuration: number;
  customReturnCoordinates: [number, number];
}

/**
 * Hook pour la création de devis
 * Gère la création de nouveaux devis avec toutes les propriétés requises
 */
export const useQuoteCreator = () => {
  const { toast } = useToast();

  /**
   * Crée un nouveau devis dans la base de données
   * @param props - Les propriétés nécessaires pour créer le devis
   * @returns Un objet Quote complet
   */
  const createQuote = async (props: CreateQuoteProps): Promise<Quote> => {
    const {
      driverId,
      clientId,
      selectedVehicle,
      departureAddress,
      destinationAddress,
      departureCoordinates,
      destinationCoordinates,
      dateTime,
      estimatedDistance,
      estimatedDuration,
      quoteDetails,
      hasReturnTrip,
      hasWaitingTime,
      waitingTimeMinutes,
      waitingTimePrice,
      returnToSameAddress,
      customReturnAddress,
      customReturnCoordinates,
      returnDistance,
      returnDuration
    } = props;

    // Valider les données essentielles
    const isValid = validateQuoteData({
      clientId,
      driverId,
      quoteDetails,
      selectedVehicle,
      departureAddress,
      destinationAddress
    });

    if (!isValid) {
      const errorMsg = "Validation du devis échouée: données incomplètes ou invalides";
      quotesLogger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      quotesLogger.info("Préparation des données du devis pour l'enregistrement");
      
      // Préparer les données du devis avec la fonction utilitaire
      const quoteData = prepareQuoteData({
        driverId,
        clientId,
        selectedVehicle,
        departureAddress,
        destinationAddress,
        departureCoordinates,
        destinationCoordinates,
        dateTime,
        estimatedDistance,
        estimatedDuration,
        quoteDetails,
        hasReturnTrip,
        hasWaitingTime,
        waitingTimeMinutes,
        waitingTimePrice,
        returnToSameAddress,
        customReturnAddress,
        customReturnCoordinates,
        returnDistance,
        returnDuration
      });

      // Créer le devis dans la base de données
      const savedQuote = await createQuoteInDb({
        driverId,
        clientId,
        quoteData
      });

      return savedQuote;
      
    } catch (error) {
      quotesLogger.error('Erreur détaillée lors de l\'enregistrement du devis:', error);
      
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { createQuote };
};
