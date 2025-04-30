
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

        let query = supabase
          .from('quotes')
          .select(`
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
            status,
            client_id
          `)
          .eq('driver_id', userId)
          .order('created_at', { ascending: false });

        if (clientId) {
          query = query.eq('client_id', clientId);
        }

        const { data, error } = await query;

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
            departure_location: '',
            arrival_location: '',
            status: validateQuoteStatus(item.status || 'pending'),
            quote_pdf: null,
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
        console.error('Error in useQuotes query:', error);
        throw error;
      }
    }
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Quote['status'] }) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status } as any)
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
