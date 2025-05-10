
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Quote } from '@/types/quote';
import { useToast } from '@/components/ui/use-toast';
import { buildQuoteQuery, QuoteFiltersOptions } from './utils/quoteQueryBuilder';
import { transformQuote } from './utils/quoteTransformer';
import { quotesLogger } from './utils/quotesLogger';

/**
 * Interface des propriétés pour le hook useQuotesList
 */
interface UseQuotesListProps {
  limit?: number;
  filters?: QuoteFiltersOptions;
}

/**
 * Hook pour la gestion de la liste des devis
 * Permet de récupérer, filtrer et rafraîchir la liste des devis
 */
export const useQuotesList = ({ limit = 10, filters }: UseQuotesListProps = {}) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        quotesLogger.info('Récupération des devis avec filtres:', filters);
        
        // Construction de la requête avec les filtres appropriés
        const query = buildQuoteQuery(user.id, limit, filters);
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }

        quotesLogger.debug('Données brutes des devis récupérées:', data);

        // Traitement des données pour correspondre au type Quote
        const processedQuotes = data.map(quote => {
          try {
            return transformQuote(quote);
          } catch (err) {
            quotesLogger.error(`Erreur lors du traitement du devis ${quote.id}:`, err);
            // Continuer avec les autres devis en cas d'erreur
            return null;
          }
        }).filter(Boolean) as Quote[]; // Suppression des devis null
        
        setQuotes(processedQuotes);
        quotesLogger.info(`Devis traités et formatés: ${processedQuotes.length}`);
      } catch (err: any) {
        quotesLogger.error('Erreur détaillée lors de la récupération des devis:', err);
        setError(err.message || 'Failed to fetch quotes');
        quotesLogger.showErrorToast(toast, 'Erreur', 'Impossible de récupérer la liste des devis');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuotes();
  }, [user, limit, filters, toast]);
  
  /**
   * Rafraîchit la liste des devis
   */
  const refetch = async () => {
    setQuotes([]);
    setIsLoading(true);
    
    if (user) {
      try {
        quotesLogger.info('Rafraîchissement des devis...');
        
        // Utilisation de la même logique de construction de requête
        const query = buildQuoteQuery(user.id, limit, filters);
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Traitement des données avec la fonction de transformation
        const processedQuotes = data.map(quote => {
          try {
            return transformQuote(quote);
          } catch (err) {
            quotesLogger.error(`Erreur lors du traitement du devis ${quote.id}:`, err);
            return null;
          }
        }).filter(Boolean) as Quote[]; // Suppression des devis null
        
        setQuotes(processedQuotes);
        quotesLogger.info(`Devis rafraîchis: ${processedQuotes.length}`);
      } catch (err: any) {
        quotesLogger.error('Erreur détaillée lors du rafraîchissement des devis:', err);
        setError(err.message || 'Failed to refresh quotes');
        quotesLogger.showErrorToast(toast, 'Erreur', 'Impossible de rafraîchir la liste des devis');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return {
    quotes,
    isLoading,
    error,
    refetch
  };
};
