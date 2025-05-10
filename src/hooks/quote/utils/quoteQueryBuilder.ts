
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface pour les options de filtre des devis
 */
export interface QuoteFiltersOptions {
  status?: 'all' | 'pending' | 'accepted' | 'rejected' | 'declined';
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Construit une requête Supabase pour récupérer les devis avec filtrages
 * @param userId ID de l'utilisateur (chauffeur)
 * @param limit Limite du nombre de résultats
 * @param filters Options de filtrage
 * @returns Une requête Supabase configurée
 */
export const buildQuoteQuery = (
  userId: string,
  limit?: number,
  filters?: QuoteFiltersOptions
) => {
  let query = supabase
    .from('quotes')
    .select(`
      *,
      clients (*),
      vehicles (*)
    `)
    .eq('driver_id', userId)
    .order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  if (filters) {
    // Application du filtre par statut
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    // Application du filtre par recherche
    if (filters.search) {
      query = query.or(`
        clients.first_name.ilike.%${filters.search}%,
        clients.last_name.ilike.%${filters.search}%,
        departure_location.ilike.%${filters.search}%,
        arrival_location.ilike.%${filters.search}%
      `);
    }
    
    // Application du filtre par plage de dates
    if (filters.dateRange) {
      const validStartDate = filters.dateRange.start instanceof Date && 
                            !isNaN(filters.dateRange.start.getTime());
      const validEndDate = filters.dateRange.end instanceof Date && 
                          !isNaN(filters.dateRange.end.getTime());
      
      if (validStartDate && validEndDate) {
        const startFormatted = filters.dateRange.start.toISOString();
        const endFormatted = filters.dateRange.end.toISOString();
        
        query = query.gte('departure_datetime', startFormatted)
                   .lte('departure_datetime', endFormatted);
      }
    }
  }
  
  return query;
};
