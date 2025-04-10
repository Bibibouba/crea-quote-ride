
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { useToast } from '@/hooks/use-toast';

// Extension du type Quote pour inclure les coordonnées
export type QuoteWithCoordinates = Quote & {
  departure_coordinates?: [number, number];
  arrival_coordinates?: [number, number];
  distance_km?: number;
  duration_minutes?: number;
  has_return_trip?: boolean;
  has_waiting_time?: boolean;
  waiting_time_minutes?: number;
  waiting_time_price?: number;
};

export const useQuotes = (clientId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get query key based on whether we're filtering by client
  const queryKey = clientId ? ['quotes', clientId] : ['quotes'];

  const {
    data: quotes,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          clients(first_name, last_name, email),
          vehicles(name, model)
        `)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching quotes', error);
        throw error;
      }

      return data as (Quote & {
        clients: { first_name: string; last_name: string; email: string };
        vehicles: { name: string; model: string } | null;
      })[];
    }
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Quote['status'] }) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating quote status', error);
        throw error;
      }

      return data as Quote;
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

  // Ajouter un nouveau devis avec les coordonnées et le calcul d'itinéraire
  const addQuote = useMutation({
    mutationFn: async (newQuote: Omit<QuoteWithCoordinates, 'id' | 'created_at' | 'updated_at' | 'quote_pdf'>) => {
      // Get the current user's ID from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Add the driver_id to the quote data
      const quoteWithDriverId = {
        ...newQuote,
        driver_id: userId
      };

      // Filtrer les propriétés non supportées par la table
      const { departure_coordinates, arrival_coordinates, ...quoteData } = quoteWithDriverId;

      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select()
        .single();

      if (error) {
        console.error('Error adding quote', error);
        throw error;
      }

      return data as Quote;
    },
    onSuccess: () => {
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
