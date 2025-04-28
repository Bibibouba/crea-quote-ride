
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';

// Type pour les filtres de recherche de devis
interface QuotesFilter {
  client_id?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  driver_id?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Hook pour récupérer et gérer la liste des devis
 */
export const useQuotesList = (initialFilters?: QuotesFilter) => {
  const queryClient = useQueryClient();
  const defaultFilters: QuotesFilter = {};
  const filters = { ...defaultFilters, ...initialFilters };

  // Récupérer tous les devis
  const fetchQuotes = async () => {
    let query = supabase.from('quotes').select(`
      *,
      clients (
        id,
        first_name,
        last_name,
        email,
        phone
      )
    `);

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    
    if (filters.driver_id) {
      query = query.eq('driver_id', filters.driver_id);
    }
    
    if (filters.status) {
      query = query.eq('quote_status', filters.status);
    }
    
    if (filters.start_date) {
      query = query.gte('created_at', filters.start_date);
    }
    
    if (filters.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Quote[];
  };

  // Mutation pour mettre à jour le statut d'un devis
  const updateQuoteStatus = async ({ id, status }: { id: string; status: 'pending' | 'accepted' | 'rejected' | 'expired' }) => {
    const { data, error } = await supabase
      .from('quotes')
      .update({ quote_status: status })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  // Mutation pour supprimer un devis
  const deleteQuote = async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { id };
  };

  // Utilisation des hooks React Query
  const quotesQuery = useQuery({
    queryKey: ['quotes', filters],
    queryFn: fetchQuotes
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateQuoteStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });

  return {
    quotes: quotesQuery.data || [],
    isLoading: quotesQuery.isLoading,
    error: quotesQuery.error,
    updateStatus: updateStatusMutation.mutate,
    deleteQuote: deleteMutation.mutate,
    setFilters: (newFilters: QuotesFilter) => {
      // Pour utiliser ce hook avec un état local de filtres
      return { ...filters, ...newFilters };
    }
  };
};
