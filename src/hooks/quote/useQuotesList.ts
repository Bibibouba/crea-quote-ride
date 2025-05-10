import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Quote } from '@/types/quote';
import { useToast } from '@/components/ui/use-toast';

interface UseQuotesListProps {
  limit?: number;
  filters?: {
    status?: 'all' | 'pending' | 'accepted' | 'rejected';
    search?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

export const useQuotesList = ({ limit = 10, filters }: UseQuotesListProps = {}) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('quotes')
          .select(`
            *,
            clients (*),
            vehicles (*)
          `)
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        if (filters) {
          // Filter by status
          if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
          }
          
          // Filter by search term
          if (filters.search) {
            query = query.or(`
              clients.first_name.ilike.%${filters.search}%,
              clients.last_name.ilike.%${filters.search}%,
              departure_location.ilike.%${filters.search}%,
              arrival_location.ilike.%${filters.search}%
            `);
          }
          
          // Filter by date range
          if (filters.dateRange) {
            // Ensure these are valid Date objects before using them
            const validStartDate = filters.dateRange.start instanceof Date && !isNaN(filters.dateRange.start.getTime());
            const validEndDate = filters.dateRange.end instanceof Date && !isNaN(filters.dateRange.end.getTime());
            
            if (validStartDate && validEndDate) {
              const startFormatted = filters.dateRange.start.toISOString();
              const endFormatted = filters.dateRange.end.toISOString();
              
              query = query.gte('departure_datetime', startFormatted)
                          .lte('departure_datetime', endFormatted);
            }
          }
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }

        // Process data to ensure all quotes are properly formatted according to the Quote type
        const processedQuotes = data.map(quote => {
          // Vérification et traitement des relations clients et vehicles
          let clientData = null;
          if (quote.clients && typeof quote.clients === 'object' && !Array.isArray(quote.clients) && !("error" in quote.clients)) {
            clientData = {
              first_name: quote.clients.first_name || "",
              last_name: quote.clients.last_name || "",
              email: quote.clients.email || "",
              phone: quote.clients.phone || ""
            };
          }
          
          let vehicleData = null;
          if (quote.vehicles && typeof quote.vehicles === 'object' && !Array.isArray(quote.vehicles) && !("error" in quote.vehicles)) {
            vehicleData = {
              name: quote.vehicles.name || "Véhicule inconnu",
              model: quote.vehicles.model || "",
              basePrice: typeof quote.vehicles.base_price === 'number' ? quote.vehicles.base_price : 0
            };
          }
          
          // Conversion type-safe des coordonnées
          const departureCoordsTyped = quote.departure_coordinates && Array.isArray(quote.departure_coordinates) && quote.departure_coordinates.length === 2 
            ? quote.departure_coordinates as [number, number] 
            : undefined;
            
          const arrivalCoordsTyped = quote.arrival_coordinates && Array.isArray(quote.arrival_coordinates) && quote.arrival_coordinates.length === 2 
            ? quote.arrival_coordinates as [number, number] 
            : undefined;
            
          const returnCoordsTyped = quote.return_coordinates && Array.isArray(quote.return_coordinates) && quote.return_coordinates.length === 2 
            ? quote.return_coordinates as [number, number] 
            : undefined;
          
          // Construction de l'objet Quote complet avec toutes les propriétés requises
          return {
            // Propriétés de base
            id: quote.id,
            driver_id: quote.driver_id,
            client_id: quote.client_id || '',
            vehicle_id: quote.vehicle_id || null,
            departure_location: quote.departure_location || '',
            arrival_location: quote.arrival_location || '',
            
            // Coordonnées typées correctement
            departure_coordinates: departureCoordsTyped,
            arrival_coordinates: arrivalCoordsTyped, 
            return_coordinates: returnCoordsTyped,
            
            // Dates et montants
            ride_date: quote.ride_date || quote.created_at,
            amount: quote.amount || quote.total_fare || 0,
            status: (quote.status as 'pending' | 'accepted' | 'declined') || 'pending',
            quote_pdf: quote.quote_pdf || null,
            created_at: quote.created_at,
            updated_at: quote.updated_at || quote.created_at,
            
            // Détails du trajet
            distance_km: quote.distance_km || 0,
            duration_minutes: quote.duration_minutes || 0,
            has_return_trip: Boolean(quote.has_return_trip),
            has_waiting_time: Boolean(quote.has_waiting_time),
            waiting_time_minutes: quote.waiting_time_minutes || 0,
            waiting_time_price: quote.waiting_time_price || 0,
            return_to_same_address: Boolean(quote.return_to_same_address),
            custom_return_address: quote.custom_return_address || '',
            return_distance_km: quote.return_distance_km || 0,
            return_duration_minutes: quote.return_duration_minutes || 0,
            
            // Détails de tarification
            has_night_rate: Boolean(quote.has_night_rate),
            night_rate_percentage: quote.night_rate_percentage || 0,
            night_hours: quote.night_hours || 0,
            night_surcharge: quote.night_surcharge || 0,
            is_sunday_holiday: Boolean(quote.is_sunday_holiday),
            sunday_holiday_percentage: quote.sunday_holiday_percentage || 0,
            sunday_holiday_surcharge: quote.sunday_holiday_surcharge || 0,
            
            // Détails de distance
            day_km: quote.day_km || 0,
            night_km: quote.night_km || 0,
            total_km: quote.total_km || quote.distance_km || 0,
            
            // Détails de prix
            day_price: quote.day_price || 0,
            night_price: quote.night_price || 0,
            
            // Détails d'attente
            wait_time_day: quote.wait_time_day || 0,
            wait_time_night: quote.wait_time_night || 0,
            wait_price_day: quote.wait_price_day || 0,
            wait_price_night: quote.wait_price_night || 0,
            
            // Détails de prix HT/TTC
            amount_ht: quote.amount_ht || quote.base_fare || 0,
            total_ht: quote.total_ht || 0,
            vat: quote.vat || 0,
            total_ttc: quote.total_ttc || quote.amount || 0,
            
            // Prix aller simple
            one_way_price_ht: quote.one_way_price_ht || 0,
            one_way_price: quote.one_way_price || 0,
            
            // Prix retour
            return_price_ht: quote.return_price_ht || 0,
            return_price: quote.return_price || 0,
            
            // Relations
            clients: clientData,
            vehicles: vehicleData,
            
            // Autres paramètres jour/nuit
            day_hours: quote.day_hours || 0
          } as Quote;
        });
        
        setQuotes(processedQuotes);
      } catch (err: any) {
        console.error('Error fetching quotes:', err);
        setError(err.message || 'Failed to fetch quotes');
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de récupérer la liste des devis'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuotes();
  }, [user, limit, filters, toast]);
  
  const refetch = async () => {
    setQuotes([]);
    setIsLoading(true);
    
    if (user) {
      try {
        let query = supabase
          .from('quotes')
          .select(`
            *,
            clients (*),
            vehicles (*)
          `)
          .eq('driver_id', user.id)
          .order('created_at', { ascending: false });
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Utiliser la même logique de transformation que dans l'effet
        const processedQuotes = data.map(quote => {
          // Même logique de transformation que ci-dessus
          // (Code identique pour éviter la duplication)
          // Vérification et traitement des relations clients et vehicles
          let clientData = null;
          if (quote.clients && typeof quote.clients === 'object' && !Array.isArray(quote.clients) && !("error" in quote.clients)) {
            clientData = {
              first_name: quote.clients.first_name || "",
              last_name: quote.clients.last_name || "",
              email: quote.clients.email || "",
              phone: quote.clients.phone || ""
            };
          }
          
          let vehicleData = null;
          if (quote.vehicles && typeof quote.vehicles === 'object' && !Array.isArray(quote.vehicles) && !("error" in quote.vehicles)) {
            vehicleData = {
              name: quote.vehicles.name || "Véhicule inconnu",
              model: quote.vehicles.model || "",
              basePrice: typeof quote.vehicles.base_price === 'number' ? quote.vehicles.base_price : 0
            };
          }
          
          // Conversion type-safe des coordonnées
          const departureCoordsTyped = quote.departure_coordinates && Array.isArray(quote.departure_coordinates) && quote.departure_coordinates.length === 2 
            ? quote.departure_coordinates as [number, number] 
            : undefined;
            
          const arrivalCoordsTyped = quote.arrival_coordinates && Array.isArray(quote.arrival_coordinates) && quote.arrival_coordinates.length === 2 
            ? quote.arrival_coordinates as [number, number] 
            : undefined;
            
          const returnCoordsTyped = quote.return_coordinates && Array.isArray(quote.return_coordinates) && quote.return_coordinates.length === 2 
            ? quote.return_coordinates as [number, number] 
            : undefined;
          
          return {
            // Même construction de l'objet que ci-dessus
            id: quote.id,
            driver_id: quote.driver_id,
            client_id: quote.client_id || '',
            vehicle_id: quote.vehicle_id || null,
            departure_location: quote.departure_location || '',
            arrival_location: quote.arrival_location || '',
            departure_coordinates: departureCoordsTyped,
            arrival_coordinates: arrivalCoordsTyped, 
            return_coordinates: returnCoordsTyped,
            ride_date: quote.ride_date || quote.created_at,
            amount: quote.amount || quote.total_fare || 0,
            status: (quote.status as 'pending' | 'accepted' | 'declined') || 'pending',
            quote_pdf: quote.quote_pdf || null,
            created_at: quote.created_at,
            updated_at: quote.updated_at || quote.created_at,
            distance_km: quote.distance_km || 0,
            duration_minutes: quote.duration_minutes || 0,
            has_return_trip: Boolean(quote.has_return_trip),
            has_waiting_time: Boolean(quote.has_waiting_time),
            waiting_time_minutes: quote.waiting_time_minutes || 0,
            waiting_time_price: quote.waiting_time_price || 0,
            return_to_same_address: Boolean(quote.return_to_same_address),
            custom_return_address: quote.custom_return_address || '',
            return_distance_km: quote.return_distance_km || 0,
            return_duration_minutes: quote.return_duration_minutes || 0,
            has_night_rate: Boolean(quote.has_night_rate),
            night_rate_percentage: quote.night_rate_percentage || 0,
            night_hours: quote.night_hours || 0,
            night_surcharge: quote.night_surcharge || 0,
            is_sunday_holiday: Boolean(quote.is_sunday_holiday),
            sunday_holiday_percentage: quote.sunday_holiday_percentage || 0,
            sunday_holiday_surcharge: quote.sunday_holiday_surcharge || 0,
            day_km: quote.day_km || 0,
            night_km: quote.night_km || 0,
            total_km: quote.total_km || quote.distance_km || 0,
            day_price: quote.day_price || 0,
            night_price: quote.night_price || 0,
            wait_time_day: quote.wait_time_day || 0,
            wait_time_night: quote.wait_time_night || 0,
            wait_price_day: quote.wait_price_day || 0,
            wait_price_night: quote.wait_price_night || 0,
            amount_ht: quote.amount_ht || quote.base_fare || 0,
            total_ht: quote.total_ht || 0,
            vat: quote.vat || 0,
            total_ttc: quote.total_ttc || quote.amount || 0,
            one_way_price_ht: quote.one_way_price_ht || 0,
            one_way_price: quote.one_way_price || 0,
            return_price_ht: quote.return_price_ht || 0,
            return_price: quote.return_price || 0,
            clients: clientData,
            vehicles: vehicleData,
            day_hours: quote.day_hours || 0
          } as Quote;
        });
        
        setQuotes(processedQuotes);
      } catch (err: any) {
        console.error('Error refreshing quotes:', err);
        setError(err.message || 'Failed to refresh quotes');
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de rafraîchir la liste des devis'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return {
    quotes,
    isLoading,
    error,
    refetch
  };
};