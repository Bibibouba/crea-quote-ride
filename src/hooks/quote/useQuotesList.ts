
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { validateQuoteStatus } from '@/services/quote/utils/validateQuoteStatus';

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
    // Construction de la requête avec des colonnes plates uniquement
    let query = supabase.from('quotes').select(`
      id, 
      driver_id,
      client_id,
      ride_date,
      base_fare,
      total_fare,
      holiday_surcharge,
      night_surcharge,
      include_return,
      outbound_duration_minutes,
      total_distance,
      waiting_fare,
      waiting_time_minutes,
      sunday_surcharge,
      vehicle_type_id,
      created_at,
      updated_at,
      status
    `);

    // Application des filtres
    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    
    if (filters.driver_id) {
      query = query.eq('driver_id', filters.driver_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.start_date) {
      query = query.gte('created_at', filters.start_date);
    }
    
    if (filters.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    // Exécution de la requête
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Forçage de type explicite pour éviter l'erreur TS2589
    const transformedData: Quote[] = (data || []).map((quote: any) => ({
      id: quote.id,
      driver_id: quote.driver_id,
      client_id: quote.client_id || '',
      vehicle_id: quote.vehicle_type_id || null,
      ride_date: quote.ride_date,
      amount: quote.total_fare,
      departure_location: '',
      arrival_location: '',
      status: validateQuoteStatus(quote.status || 'pending'),
      quote_pdf: null,
      created_at: quote.created_at,
      updated_at: quote.updated_at || quote.created_at,
      // Autres propriétés avec valeurs par défaut
      distance_km: quote.total_distance,
      duration_minutes: quote.outbound_duration_minutes,
      has_return_trip: quote.include_return || false,
      has_waiting_time: !!quote.waiting_time_minutes,
      waiting_time_minutes: quote.waiting_time_minutes,
      waiting_time_price: quote.waiting_fare,
      night_surcharge: quote.night_surcharge,
      sunday_holiday_surcharge: quote.sunday_surcharge,
      amount_ht: quote.base_fare,
      total_ttc: quote.total_fare,
      clients: undefined,
      vehicles: null
    }));

    return transformedData;
  };

  // Mutation pour mettre à jour le statut d'un devis
  const updateQuoteStatus = async ({ id, status }: { id: string; status: Quote['status'] }) => {
    // Cast explicite avec as any pour éviter l'erreur TS2353
    const { data, error } = await supabase
      .from('quotes')
      .update({ status } as any)
      .eq('id', id)
      .select();

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
      return { ...filters, ...newFilters };
    }
  };
};
