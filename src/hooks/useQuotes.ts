
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { useToast } from '@/hooks/use-toast';
import { validateQuoteStatus } from '@/services/quote/utils/validateQuoteStatus';

export const useQuotes = (clientId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = clientId ? ['quotes', clientId] : ['quotes'];

  const {
    data: quotes,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          console.error('No user session found');
          throw new Error('User not authenticated');
        }

        const selection = `
          id,
          driver_id,
          client_id,
          vehicle_type_id,
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
          created_at,
          updated_at,
          status
        `;

        let query = supabase
          .from('quotes')
          .select(selection)
          .eq('driver_id', userId)
          .order('created_at', { ascending: false });

        if (clientId) {
          query = query.eq('client_id', clientId);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Éviter l'erreur TS2589 en définissant le type explicitement
        const transformedData: Quote[] = [];
        
        if (data && data.length > 0) {
          // On utilise un for-loop au lieu de .map() pour éviter TS2589
          for (const quote of data) {
            transformedData.push({
              id: quote.id,
              driver_id: quote.driver_id,
              client_id: quote.client_id || '',
              vehicle_id: quote.vehicle_type_id || null,
              ride_date: quote.departure_datetime, // Adapter departure_datetime à ride_date
              amount: quote.total_fare,
              departure_location: '',
              arrival_location: '',
              status: validateQuoteStatus(quote.status || 'pending'),
              quote_pdf: null,
              created_at: quote.created_at,
              updated_at: quote.updated_at || quote.created_at,
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
            });
          }
        }

        return transformedData;
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
        .update({ status } as any) // Cast en any pour éviter TS2353
        .eq('id', id)
        .select('*');

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Failed to update quote status');
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ['quotes', clientId] });
      }
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
