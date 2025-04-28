
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { RawQuote } from '@/types/raw-quote';
import { useToast } from '@/hooks/use-toast';

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
            clients (
              first_name,
              last_name,
              email,
              phone
            ),
            vehicles (
              name,
              model
            )
          `)
          .eq('driver_id', userId)
          .order('created_at', { ascending: false });

        if (clientId) {
          query = query.eq('client_id', clientId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching quotes', error);
          throw error;
        }
        
        const transformedData: Quote[] = (data || []).map(quote => {
          // S'assurer que toutes les propriétés sont présentes pour éviter les erreurs TypeScript
          return {
            id: quote.id,
            driver_id: quote.driver_id,
            client_id: clientId || '',
            vehicle_id: quote.vehicle_type_id,
            ride_date: quote.departure_datetime,
            amount: quote.total_fare,
            departure_location: '',
            arrival_location: '',
            status: 'pending',
            quote_pdf: null,
            created_at: quote.created_at,
            updated_at: quote.created_at,
            distance_km: quote.total_distance,
            duration_minutes: quote.outbound_duration_minutes,
            has_return_trip: quote.include_return,
            has_waiting_time: !!quote.waiting_time_minutes,
            waiting_time_minutes: quote.waiting_time_minutes,
            waiting_time_price: quote.waiting_fare,
            night_surcharge: quote.night_surcharge,
            sunday_holiday_surcharge: quote.sunday_surcharge,
            // Ces champs pourraient ne pas être présents dans la réponse,
            // mais nous les incluons dans le type transformé pour la compatibilité
            amount_ht: 0,
            total_ttc: 0,
            clients: quote.clients,
            vehicles: quote.vehicles && {
              ...quote.vehicles,
              basePrice: 0
            }
          };
        });
        
        return transformedData;
      } catch (error) {
        console.error('Error in useQuotes query:', error);
        throw error;
      }
    }
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'accepted' | 'declined' }) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating quote status', error);
        throw error;
      }

      return { 
        ...(data?.[0] || {}),
        status
      } as unknown as Quote;
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
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour du statut: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const addQuote = useMutation({
    mutationFn: async (newQuote: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf">) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          console.error('User not authenticated when adding quote');
          throw new Error("User not authenticated");
        }
        
        console.log('Creating quote with driver_id:', userId);
        
        const quotePayload = {
          driver_id: userId,
          base_fare: newQuote.amount || 0,
          departure_datetime: newQuote.ride_date || new Date().toISOString(),
          total_distance: newQuote.distance_km || 0,
          total_fare: newQuote.amount || 0,
          outbound_duration_minutes: newQuote.duration_minutes || 0,
          vehicle_type_id: newQuote.vehicle_id,
          waiting_fare: newQuote.waiting_time_price || 0,
          waiting_time_minutes: newQuote.waiting_time_minutes || 0,
          include_return: newQuote.has_return_trip || false,
          night_surcharge: newQuote.night_surcharge || 0,
          holiday_surcharge: newQuote.sunday_holiday_surcharge || 0,
          sunday_surcharge: newQuote.sunday_holiday_surcharge || 0
        };

        const { data, error } = await supabase
          .from('quotes')
          .insert(quotePayload)
          .select();

        if (error) {
          console.error('Error adding quote', error);
          throw error;
        }

        console.log('Quote created successfully:', data);
        
        const createdQuote: Quote = {
          ...newQuote,
          id: data?.[0]?.id || '',
          created_at: data?.[0]?.created_at || new Date().toISOString(),
          updated_at: data?.[0]?.updated_at || new Date().toISOString(),
          quote_pdf: null
        };
        
        return createdQuote;
      } catch (error) {
        console.error('Error in addQuote mutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Quote added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      if (clientId) {
        queryClient.invalidateQueries({ queryKey: ['quotes', clientId] });
      }
      toast({
        title: 'Devis créé',
        description: 'Le devis a été créé avec succès',
      });
    },
    onError: (error) => {
      console.error('Error in addQuote onError handler:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de la création du devis: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    quotes: quotes || [],
    isLoading,
    error: error ? (error as Error).message : null,
    updateQuoteStatus,
    addQuote,
    refetch,
  };
};
