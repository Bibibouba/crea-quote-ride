
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { RawQuote } from '@/types/raw-quote';

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
    // Construction de la requête
    let query = supabase.from('quotes').select(`
      id, 
      driver_id,
      departure_datetime,
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

    // Conversion explicite vers le type RawQuote
    const rawQuotes = data as unknown as Array<RawQuote>;
    
    // Transformation manuelle et typée vers Quote[]
    const quotes: Quote[] = (rawQuotes || []).map(quote => ({
      id: quote.id,
      driver_id: quote.driver_id,
      client_id: '', // On définit une valeur par défaut
      vehicle_id: quote.vehicle_type_id || null,
      departure_location: '',
      arrival_location: '',
      ride_date: quote.departure_datetime,
      amount: quote.total_fare,
      status: (quote.status as 'pending' | 'accepted' | 'rejected' | 'expired') || 'pending',
      quote_pdf: null,
      created_at: quote.created_at,
      updated_at: quote.updated_at || quote.created_at,
      // Autres propriétés
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
      clients: quote.clients ? {
        first_name: quote.clients.first_name || '',
        last_name: quote.clients.last_name || '',
        email: quote.clients.email || '',
        phone: quote.clients.phone || ''
      } : undefined,
      vehicles: null // On ne récupère pas les véhicules pour éviter la récursion
    }));

    return quotes;
  };

  // Mutation pour mettre à jour le statut d'un devis
  const updateQuoteStatus = async ({ id, status }: { id: string; status: 'pending' | 'accepted' | 'rejected' | 'expired' }) => {
    const { data, error } = await supabase
      .from('quotes')
      .update({ status })
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
