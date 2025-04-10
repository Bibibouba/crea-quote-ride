
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { useToast } from '@/hooks/use-toast';

// Extended Quote type including coordinates
export type QuoteWithCoordinates = Quote;

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

  // Ajouter un nouveau devis
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
        driver_id: userId,
        // Store coordinates as arrays for Supabase
        departure_coordinates: newQuote.departure_coordinates || null,
        arrival_coordinates: newQuote.arrival_coordinates || null,
        return_coordinates: newQuote.return_coordinates || null,
        return_distance_km: newQuote.return_distance_km || null,
        return_duration_minutes: newQuote.return_duration_minutes || null
      };

      console.log('Saving quote data:', JSON.stringify(quoteWithDriverId, null, 2));

      // Create the quote
      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteWithDriverId)
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
