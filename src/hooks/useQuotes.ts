
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { useToast } from '@/hooks/use-toast';
import { validateQuoteStatus } from '@/utils/validateQuoteStatus';

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
          // Create a properly formatted quote object with safe checking
          // Vérifier si les propriétés existent avant d'y accéder
          const formattedQuote: Quote = {
            ...quote,
            id: quote.id,
            driver_id: quote.driver_id,
            client_id: quote.client_id,
            vehicle_id: quote.vehicle_type_id || null, // Map vehicle_type_id to vehicle_id
            departure_location: quote.departure_location || '',
            arrival_location: quote.arrival_location || '',
            ride_date: quote.departure_datetime || '', // Map departure_datetime to ride_date
            amount: quote.total_fare || 0, // Map total_fare to amount
            status: validateQuoteStatus(quote.status || 'pending'),
            quote_pdf: quote.quote_pdf || null,
            created_at: quote.created_at || '',
            updated_at: quote.updated_at || '',
            distance_km: quote.total_distance || 0, // Map total_distance to distance_km
            duration_minutes: quote.outbound_duration_minutes || 0, // Map outbound_duration_minutes to duration_minutes
            
            // Gérer les coordonnées avec vérification
            departure_coordinates: quote.departure_coordinates || undefined,
            arrival_coordinates: quote.arrival_coordinates || undefined,
            return_coordinates: quote.return_coordinates || undefined,
            
            // Traiter les données relationnelles avec vérification
            clients: quote.clients ? {
              first_name: quote.clients.first_name || '',
              last_name: quote.clients.last_name || '',
              email: quote.clients.email || '',
              phone: quote.clients.phone || ''
            } : undefined,
            
            // Traiter les données de véhicules avec vérification
            vehicles: quote.vehicles ? {
              name: quote.vehicles.name || 'Véhicule inconnu',
              model: quote.vehicles.model || '?',
              basePrice: 0
            } : null
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

      // Convertir correctement le résultat en type Quote
      const updatedQuote: Quote = {
        ...data,
        vehicle_id: data.vehicle_type_id || null,
        ride_date: data.departure_datetime || '',
        amount: data.total_fare || 0,
        distance_km: data.total_distance || 0,
        duration_minutes: data.outbound_duration_minutes || 0,
        status: validateQuoteStatus(data.status)
      };

      return updatedQuote;
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
        
        // Adapter les noms de champs pour la base de données
        const quoteToInsert = {
          driver_id: userId,
          client_id: newQuote.client_id,
          vehicle_type_id: newQuote.vehicle_id, // Map vehicle_id to vehicle_type_id
          departure_location: newQuote.departure_location || '',
          arrival_location: newQuote.arrival_location || '',
          total_distance: newQuote.distance_km || 0, // Map distance_km to total_distance
          outbound_duration_minutes: newQuote.duration_minutes || 0, // Map duration_minutes to outbound_duration_minutes
          departure_datetime: newQuote.ride_date || new Date().toISOString(), // Map ride_date to departure_datetime
          total_fare: newQuote.amount || 0, // Map amount to total_fare
          status: newQuote.status || 'pending',
          base_fare: 0, // Champ obligatoire dans la base de données
          
          // Autres champs
          include_return: newQuote.has_return_trip || false,
          has_waiting_time: newQuote.has_waiting_time || false,
          waiting_time_minutes: newQuote.waiting_time_minutes || 0,
          waiting_fare: newQuote.waiting_time_price || 0,
          return_to_same_address: newQuote.return_to_same_address || false,
          custom_return_address: newQuote.custom_return_address || '',
          return_duration_minutes: newQuote.return_duration_minutes || 0,
          departure_coordinates: newQuote.departure_coordinates,
          arrival_coordinates: newQuote.arrival_coordinates,
          return_coordinates: newQuote.return_coordinates,
          
          // Champs pour les tarifs jour/nuit
          day_km: newQuote.day_km || 0,
          night_km: newQuote.night_km || 0,
          total_km: newQuote.total_km || 0,
          day_price: newQuote.day_price || 0,
          night_price: newQuote.night_price || 0,
          night_surcharge: newQuote.night_surcharge || 0,
          has_night_rate: newQuote.has_night_rate || false,
          night_hours: newQuote.night_hours || 0,
          night_rate_percentage: newQuote.night_rate_percentage || 0,
          is_sunday_holiday: newQuote.is_sunday_holiday || false,
          sunday_holiday_percentage: newQuote.sunday_holiday_percentage || 0,
          sunday_holiday_surcharge: newQuote.sunday_holiday_surcharge || 0,
          wait_time_day: newQuote.wait_time_day || 0,
          wait_time_night: newQuote.wait_time_night || 0,
          wait_price_day: newQuote.wait_price_day || 0,
          wait_price_night: newQuote.wait_price_night || 0
        };

        // Créer le devis
        const { data, error } = await supabase
          .from('quotes')
          .insert(quoteToInsert)
          .select()
          .single();

        if (error) {
          console.error('Error adding quote', error);
          throw error;
        }

        console.log('Quote created successfully:', data);
        
        // Convertir le résultat en type Quote
        const createdQuote: Quote = {
          ...data,
          vehicle_id: data.vehicle_type_id || null,
          ride_date: data.departure_datetime || '',
          amount: data.total_fare || 0,
          distance_km: data.total_distance || 0,
          duration_minutes: data.outbound_duration_minutes || 0,
          status: validateQuoteStatus(data.status),
          has_return_trip: data.include_return || false,
          waiting_time_price: data.waiting_fare || 0
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
