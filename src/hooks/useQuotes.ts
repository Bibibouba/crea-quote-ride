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
          identifiant_type_vehicule,
          date_heure_de_depart,
          tarif_de_base,
          tarif_total,
          supplement_vacances,
          supplement_de_nuit,
          inclure_retour,
          duree_sortie_minutes,
          distance_totale,
          tarif_attente,
          minutes_attente,
          supplement_du_dimanche,
          cree_a,
          mis_a_jour_a,
          statut
        `;

        let query = supabase
          .from('citations')
          .select(selection)
          .eq('driver_id', userId)
          .order('cree_a', { ascending: false });

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
          vehicle_id: quote.identifiant_type_vehicule || null,
          ride_date: quote.date_heure_de_depart,
          amount: quote.tarif_total,
          departure_location: '',
          arrival_location: '',
          status: validateQuoteStatus(quote.statut || 'pending'),
          quote_pdf: null,
          created_at: quote.cree_a,
          updated_at: quote.mis_a_jour_a || quote.cree_a,
          distance_km: quote.distance_totale,
          duration_minutes: quote.duree_sortie_minutes,
          has_return_trip: quote.inclure_retour || false,
          has_waiting_time: !!quote.minutes_attente,
          waiting_time_minutes: quote.minutes_attente,
          waiting_time_price: quote.tarif_attente,
          night_surcharge: quote.supplement_de_nuit,
          sunday_holiday_surcharge: quote.supplement_du_dimanche,
          amount_ht: quote.tarif_de_base,
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
