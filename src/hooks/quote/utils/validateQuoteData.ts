
import { QuoteDetailsType } from '@/types/quoteForm';
import { quotesLogger } from './quotesLogger';

/**
 * Interface pour les données à valider avant de créer un devis
 */
interface ValidateQuoteParams {
  clientId?: string;
  driverId?: string;
  quoteDetails?: QuoteDetailsType | null;
  selectedVehicle?: string;
  departureAddress?: string;
  destinationAddress?: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  hasReturnTrip?: boolean;
  returnToSameAddress?: boolean;
  customReturnAddress?: string;
}

/**
 * Valide les données essentielles du devis avant sa création
 * @param params Les données à valider
 * @returns True si les données sont valides, sinon false
 */
export const validateQuoteData = (params: ValidateQuoteParams): boolean => {
  const { clientId, driverId, quoteDetails, selectedVehicle, departureAddress, destinationAddress } = params;
  
  // Vérifie que toutes les valeurs essentielles sont présentes
  if (!clientId) {
    quotesLogger.error("Erreur de validation: ID client manquant");
    return false;
  }
  
  if (!driverId) {
    quotesLogger.error("Erreur de validation: ID chauffeur manquant");
    return false;
  }
  
  if (!quoteDetails) {
    quotesLogger.error("Erreur de validation: détails du devis manquants");
    return false;
  }
  
  if (!selectedVehicle) {
    quotesLogger.error("Erreur de validation: véhicule non sélectionné");
    return false;
  }
  
  if (!departureAddress || !destinationAddress) {
    quotesLogger.error("Erreur de validation: adresses de départ ou d'arrivée manquantes");
    return false;
  }
  
  return true;
};
