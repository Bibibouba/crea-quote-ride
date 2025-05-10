
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

        // Process data to ensure all date fields are properly converted to Date objects
        const processedQuotes = data.map(quote => {
          // Safely convert string dates to Date objects
          const safeDate = (dateStr: string | null | undefined) => {
            if (!dateStr) return null;
            
            try {
              const date = new Date(dateStr);
              // Check if date is valid
              if (isNaN(date.getTime())) {
                console.warn(`Invalid date string: ${dateStr}`);
                return null;
              }
              return date;
            } catch (e) {
              console.warn(`Error parsing date: ${dateStr}`, e);
              return null;
            }
          };
          
          // Cast to Quote type with necessary transformations
          return {
            id: quote.id,
            driver_id: quote.driver_id,
            client_id: quote.client_id || '',
            vehicle_id: quote.vehicle_id,
            departure_location: quote.departure_location || '',
            arrival_location: quote.arrival_location || '',
            ride_date: quote.ride_date || quote.departure_datetime,
            amount: quote.amount || quote.total_fare,
            status: quote.status || 'pending',
            quote_pdf: quote.quote_pdf,
            created_at: quote.created_at,
            updated_at: quote.updated_at || quote.created_at,
            distance_km: quote.distance_km || quote.total_distance,
            duration_minutes: quote.duration_minutes || quote.outbound_duration_minutes,
            has_return_trip: quote.has_return_trip || quote.include_return || false,
            has_waiting_time: !!quote.waiting_time_minutes,
            waiting_time_minutes: quote.waiting_time_minutes || 0,
            waiting_time_price: quote.waiting_time_price || quote.waiting_fare || 0,
            night_surcharge: quote.night_surcharge || 0,
            sunday_holiday_surcharge: quote.sunday_holiday_surcharge || quote.sunday_surcharge || 0,
            amount_ht: quote.amount_ht || quote.base_fare,
            total_ttc: quote.total_ttc || quote.total_fare,
            clients: quote.clients,
            vehicles: quote.vehicles
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
  
  return {
    quotes,
    isLoading,
    error,
    refetch: () => {
      setQuotes([]);
      setIsLoading(true);
    }
  };
};
