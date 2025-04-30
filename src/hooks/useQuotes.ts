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
          identifiant,
          driver_id,
          identifiant_type_véhicule,
          date_heure_de_départ,
          tarif_de_base,
          tarif_total,
          supplément vacances,
          supplément de nuit,
          inclure_retour,
          durée_sortie_minutes,
          distance_totale,
          tarif d'attente,
          minutes_d'attente,
          supplément du dimanche,
          créé_à,
          mis à jour à,
          statut
        `;

        let query = supabase
          .from('citations')
          .select(selection)
          .eq('driver_id', userId)
          .order('créé_à', { ascending: false });

        if (clientId) {
          query = query.eq('client_id', clientId);
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log('Quotes data received:', data);

        const transformedData: Quote[] = (data || []).map((quote: any): Quote => ({
          id: quote.identifiant,
          driver_id: quote.driver_id,
          client_id: clientId || '',
          vehicle_id: quote.identifiant_type_véhicule || null,
          ride_date: quote.date_heure_de_départ,
          amount: quote.tarif_total,
          departure_location: '',
          arrival_location: '',
          status: validateQuoteStatus(quote.statut || 'pending'),
          quote_pdf: null,
          created_at: quote.créé_à,
          updated_at: quote['mis à jour à'] || quote.créé_à,
          distance_km: quote.distance_totale,
          duration_minutes: quote.durée_sortie_minutes,
          has_return_trip: quote.inclure_retour || false,
          has_waiting_time: !!quote["minutes_d'attente"],
          waiting_time_minutes: quote["minutes_d'attente"],
          waiting_time_price: quote["tarif d'attente"],
          night_surcharge: quote["supplément de nuit"],
          sunday_holiday_surcharge: quote["supplément du dimanche"],
          amount_ht: quote["tarif_de_base"],
          total_ttc: quote.tarif_total,
          clients: undefined,
          vehicles: null
        }));

        return transformedData;
      } catch (error) {
        console.error('Error in useQuotes query:', error);
        throw error;
      }
    }
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Quote['status'] }) => {
      const updateData = { statut: status };

      const { data, error } = await supabase
        .from('citations')
        .update(updateData)
        .eq('identifiant', id)
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
