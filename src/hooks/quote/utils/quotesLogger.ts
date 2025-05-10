
import { useToast } from '@/components/ui/use-toast';

/**
 * Interface pour les options du logger
 */
interface QuotesLoggerOptions {
  enableConsoleLog?: boolean;
  enableToasts?: boolean;
}

/**
 * Crée un logger spécifique pour les opérations liées aux devis
 * @param options Options de configuration du logger
 * @returns Un objet logger avec méthodes info, error et debug
 */
export const createQuotesLogger = (options: QuotesLoggerOptions = {}) => {
  const { enableConsoleLog = true, enableToasts = true } = options;
  
  return {
    /**
     * Journalise une information
     * @param message Message principal
     * @param data Données additionnelles
     */
    info: (message: string, data?: any) => {
      if (enableConsoleLog) {
        console.log(`📋 INFO: ${message}`, data || '');
      }
    },
    
    /**
     * Journalise une erreur
     * @param message Message d'erreur
     * @param error Objet d'erreur
     */
    error: (message: string, error?: any) => {
      if (enableConsoleLog) {
        console.error(`📋 ERROR: ${message}`);
        
        if (error) {
          if (error instanceof Error) {
            console.error(`Type: ${error.constructor.name}`);
            console.error(`Message: ${error.message}`);
            console.error(`Stack: ${error.stack}`);
          } else {
            console.error('Détails:', error);
          }
        }
      }
    },
    
    /**
     * Journalise des informations de débogage
     * @param message Message de débogage
     * @param data Données additionnelles
     */
    debug: (message: string, data?: any) => {
      if (enableConsoleLog) {
        console.debug(`📋 DEBUG: ${message}`, data || '');
      }
    },
    
    /**
     * Affiche un toast d'erreur
     * @param toast Fonction toast
     * @param title Titre du toast
     * @param description Description détaillée
     */
    showErrorToast: (toast: ReturnType<typeof useToast>['toast'], title: string, description: string) => {
      if (enableToasts) {
        toast({
          variant: 'destructive',
          title,
          description
        });
      }
    }
  };
};

export const quotesLogger = createQuotesLogger();
