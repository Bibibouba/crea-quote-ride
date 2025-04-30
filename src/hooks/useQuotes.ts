
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { RawQuote } from '@/types/raw-quote';
import { useToast } from '@/hooks/use-toast';
import { validateQuoteStatus } from '@/services/quote/utils/validateQuoteStatus';

export const useQuotes = (clientId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: quotes,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['quotes', { clientId }],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          console.error('No user session found');
          throw new Error('User not authenticated');
        }

        let query = supabase
          .from('quotes')
          .select(`
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
          `)
          .eq('driver_id', userId);
          
        if (clientId) {
          query = query.eq('client_id', clientId);
        }
          
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          return [] as Quote[];
        }

        const result: Quote[] = [];

        for (const item of data) {
          const quote = item as unknown as RawQuote;

          result.push({
            id: quote.id,
            driver_id: quote.driver_id,
            client_id: quote.client_id || '',
            vehicle_id: quote.vehicle_type_id || null,
            ride_date: quote.departure_datetime,
            amount: quote.total_fare,
            departure_location: quote.departure_location || '',
            arrival_location: quote.arrival_location || '',
            status: validateQuoteStatus(quote.status || 'pending'),
            quote_pdf: quote.quote_pdf,
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

        return result;
      } catch (error) {
        console.error('Error in useQuotes query:', error);
        throw error;
      }
    }
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Quote['status'] }) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut du devis a été mis à jour avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour du statut: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    quotes: quotes || [],
    isLoading,
    error: error ? (error as Error).message : null,
    updateQuoteStatus,
    refetch,
  };
};
