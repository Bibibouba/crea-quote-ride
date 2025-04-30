
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { validateQuoteStatus } from '@/services/quote/utils/validateQuoteStatus';
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
    try {
      // Construction de la requête avec des colonnes plates uniquement
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
        updated_at
      `);

      // Application des filtres
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
        console.error('Supabase query error:', error);
        throw error;
      }
      
      // Si aucun résultat, retourner un tableau vide
      if (!data || data.length === 0) {
        return [] as Quote[];
      }

      // Transformer explicitement les données pour éviter l'erreur TS2589
      const transformedData: Quote[] = [];
      
      for (let i = 0; i < data.length; i++) {
        const quote = data[i] as unknown as RawQuote;
        
        transformedData.push({
          id: quote.id,
          driver_id: quote.driver_id,
          client_id: quote.client_id || '',
          vehicle_id: quote.vehicle_type_id || null,
          ride_date: quote.departure_datetime,
          amount: quote.total_fare,
          departure_location: '',  // Information non disponible dans la table
          arrival_location: '',    // Information non disponible dans la table
          status: validateQuoteStatus(quote.status || 'pending'),
          quote_pdf: null,
          created_at: quote.created_at,
          updated_at: quote.updated_at || quote.created_at,
          distance_km: quote.total_distance,
          duration_minutes: quote.outbound_duration_minutes,
          has_return_trip: quote.include_return || false,
          has_waiting_time: !!quote.waiting_time_minutes,
          waiting_time_minutes: quote.waiting_time_minutes || 0,
          waiting_time_price: quote.waiting_fare || 0,
          night_surcharge: quote.night_surcharge || 0,
          sunday_holiday_surcharge: quote.sunday_surcharge || 0,
          amount_ht: quote.base_fare,
          total_ttc: quote.total_fare,
          clients: undefined,
          vehicles: null
        });
      }

      return transformedData;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  };

  // Mutation pour mettre à jour le statut d'un devis
  const updateQuoteStatus = async ({ id, status }: { id: string; status: Quote['status'] }) => {
    try {
      // Utilisation du casting explicite pour éviter TS2353
      const { data, error } = await supabase
        .from('quotes')
        .update({ status } as any)
        .eq('id', id)
        .select('*');

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  };

  // Mutation pour supprimer un devis
  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { id };
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
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
