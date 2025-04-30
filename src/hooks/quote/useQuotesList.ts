
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { validateQuoteStatus } from '@/services/quote/utils/validateQuoteStatus';
import { RawQuote } from '@/types/raw-quote';

interface QuotesFilter {
  client_id?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  driver_id?: string;
  start_date?: string;
  end_date?: string;
}

export const useQuotesList = (initialFilters?: QuotesFilter) => {
  const queryClient = useQueryClient();
  const defaultFilters: QuotesFilter = {};
  const filters = { ...defaultFilters, ...initialFilters };

  const fetchQuotes = async () => {
    try {
      let query = supabase.from('quotes').select(`
        id,
        driver_id,
        client_id,
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
        status,
        departure_location,
        arrival_location,
        quote_pdf
      `);

      if (filters.driver_id) {
        query = query.eq('driver_id', filters.driver_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }

      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      const result: Quote[] = [];

      // Utilisation d'une boucle for au lieu d'un map pour éviter les erreurs de typage
      for (let i = 0; i < data.length; i++) {
        const item = data[i] as any;
        
        result.push({
          id: item.id,
          driver_id: item.driver_id,
          client_id: item.client_id || '',
          vehicle_id: item.vehicle_type_id || null,
          ride_date: item.departure_datetime,
          amount: item.total_fare,
          departure_location: item.departure_location || '',
          arrival_location: item.arrival_location || '',
          status: validateQuoteStatus(item.status || 'pending'),
          quote_pdf: item.quote_pdf,
          created_at: item.created_at,
          updated_at: item.updated_at || item.created_at,
          distance_km: item.total_distance,
          duration_minutes: item.outbound_duration_minutes,
          has_return_trip: item.include_return || false,
          has_waiting_time: !!item.waiting_time_minutes,
          waiting_time_minutes: item.waiting_time_minutes || 0,
          waiting_time_price: item.waiting_fare || 0,
          night_surcharge: item.night_surcharge || 0,
          sunday_holiday_surcharge: item.sunday_surcharge || 0,
          amount_ht: item.base_fare,
          total_ttc: item.total_fare,
          clients: undefined,
          vehicles: null
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  };

  const updateQuoteStatus = async ({ id, status }: { id: string; status: Quote['status'] }) => {
    const { data, error } = await supabase
      .from('quotes')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    return data;
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { id };
  };

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
