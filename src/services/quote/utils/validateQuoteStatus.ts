
import { Quote } from '@/types/quote';

// Définir tous les statuts valides possibles
const VALID_STATUSES = ['pending', 'accepted', 'declined', 'rejected', 'expired'] as const;
type ValidStatus = typeof VALID_STATUSES[number];

/**
 * Valide et normalise le statut d'un devis
 * @param status Le statut à valider
 * @returns Un statut valide pour le type Quote
 */
export const validateQuoteStatus = (status: string | undefined): Quote['status'] => {
  if (!status) return 'pending';
  
  // Si le statut est l'un des statuts valides, le retourner
  if (VALID_STATUSES.includes(status as ValidStatus)) {
    return status as Quote['status'];
  }
  
  // Sinon, retourner le statut par défaut
  return 'pending';
};
