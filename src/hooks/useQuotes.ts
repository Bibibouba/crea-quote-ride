
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
      try {
        // Get the current user's ID from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          console.error('No user session found');
          throw new Error('User not authenticated');
        }
        
        console.log('Fetching quotes for driver:', userId);
        
        // Build the query filtering by driver_id
        let query = supabase
          .from('quotes')
          .select(`
            *,
            clients(first_name, last_name, email, phone),
            vehicles(name, model)
          `)
          .eq('driver_id', userId)
          .order('created_at', { ascending: false });

        // If a clientId is provided, also filter by client
        if (clientId) {
          query = query.eq('client_id', clientId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching quotes', error);
          throw error;
        }
        
        console.log(`Fetched ${data?.length || 0} quotes for driver ${userId}`, data);
        
        // Transform data to ensure coordinates are correctly typed
        const transformedData = data?.map(quote => {
          // Create a properly formatted quote object
          const formattedQuote: Quote = {
            ...quote,
            // Ensure coordinates are handled properly
            departure_coordinates: quote.departure_coordinates || undefined,
            arrival_coordinates: quote.arrival_coordinates || undefined,
            return_coordinates: quote.return_coordinates || undefined,
            // Handle potentially missing related data
            clients: quote.clients || undefined,
            // Explicitly cast status to the union type
            status: validateQuoteStatus(quote.status),
            // Safely handle vehicles data with proper null checking
            vehicles: quote.vehicles && typeof quote.vehicles === 'object' 
              ? {
                  name: quote.vehicles.name || 'Véhicule inconnu',
                  model: quote.vehicles.model || '?',
                  basePrice: 0 // Note: basePrice isn't available in vehicles table, we'll handle it elsewhere
                }
              : null
          };
          
          return formattedQuote;
        });
        
        return transformedData || [];
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

  const addQuote = useMutation({
    mutationFn: async (newQuote: Omit<QuoteWithCoordinates, "id" | "created_at" | "updated_at" | "quote_pdf">) => {
      try {
        // Get the current user's ID from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          console.error('User not authenticated when adding quote');
          throw new Error("User not authenticated");
        }
        
        console.log('Creating quote with driver_id:', userId);
        console.log('Quote data:', JSON.stringify(newQuote));
        
        // Ensure we use the correct driver_id
        const quoteWithDriverId = {
          ...newQuote,
          driver_id: userId,
          // Add day/night rate fields if they exist in the quote details
          day_km: newQuote.day_km,
          night_km: newQuote.night_km,
          total_km: newQuote.total_km,
          day_price: newQuote.day_price,
          night_price: newQuote.night_price,
          night_surcharge: newQuote.night_surcharge,
          has_night_rate: newQuote.has_night_rate,
          night_hours: newQuote.night_hours,
          night_rate_percentage: newQuote.night_rate_percentage,
          is_sunday_holiday: newQuote.is_sunday_holiday,
          sunday_holiday_percentage: newQuote.sunday_holiday_percentage,
          sunday_holiday_surcharge: newQuote.sunday_holiday_surcharge,
          wait_time_day: newQuote.wait_time_day,
          wait_time_night: newQuote.wait_time_night,
          wait_price_day: newQuote.wait_price_day,
          wait_price_night: newQuote.wait_price_night
        };

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

        console.log('Quote created successfully:', data);
        return data as Quote;
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
