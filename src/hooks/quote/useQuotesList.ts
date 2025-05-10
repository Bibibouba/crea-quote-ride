
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Quote } from '@/types/quote';
import { useToast } from '@/components/ui/use-toast';

/**
 * Interface des propriétés pour le hook useQuotesList
 */
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

/**
 * Hook pour la gestion de la liste des devis
 * Permet de récupérer, filtrer et rafraîchir la liste des devis
 */
export const useQuotesList = ({ limit = 10, filters }: UseQuotesListProps = {}) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fonction utilitaire pour vérifier si un objet est valide
  const isValidObject = (obj: any): boolean => {
    return obj && 
           typeof obj === 'object' && 
           !Array.isArray(obj) && 
           !("error" in obj);
  };
  
  // Fonction pour traiter les relations des clients
  const processClientData = (clientData: any) => {
    if (!isValidObject(clientData)) {
      return null;
    }
    
    return {
      first_name: clientData.first_name || "",
      last_name: clientData.last_name || "",
      email: clientData.email || "",
      phone: clientData.phone || ""
    };
  };
  
  // Fonction pour traiter les relations des véhicules
  const processVehicleData = (vehicleData: any) => {
    if (!isValidObject(vehicleData)) {
      return null;
    }
    
    return {
      name: vehicleData.name || "Véhicule inconnu",
      model: vehicleData.model || "",
      basePrice: typeof vehicleData.base_price === 'number' ? vehicleData.base_price : 0
    };
  };
  
  // Fonction pour convertir les coordonnées en format attendu
  const processCoordinates = (coords: any): [number, number] | undefined => {
    if (coords && Array.isArray(coords) && coords.length === 2) {
      return coords as [number, number];
    }
    return undefined;
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Récupération des devis avec filtres:', filters);
        
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
          // Application des filtres
          if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
          }
          
          if (filters.search) {
            query = query.or(`
              clients.first_name.ilike.%${filters.search}%,
              clients.last_name.ilike.%${filters.search}%,
              departure_location.ilike.%${filters.search}%,
              arrival_location.ilike.%${filters.search}%
            `);
          }
          
          if (filters.dateRange) {
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

        console.log('Données brutes des devis récupérées:', data);

        // Traitement des données pour correspondre au type Quote
        const processedQuotes = data.map(quote => {
          try {
            // Traiter les relations
            const clientData = processClientData(quote.clients);
            const vehicleData = processVehicleData(quote.vehicles);
            
            // Traiter les coordonnées
            const departureCoords = processCoordinates(quote.departure_coordinates);
            const arrivalCoords = processCoordinates(quote.arrival_coordinates);
            const returnCoords = processCoordinates(quote.return_coordinates);
            
            // Construction de l'objet Quote avec toutes les propriétés requises
            const processedQuote: Quote = {
              // Propriétés de base
              id: quote.id,
              driver_id: quote.driver_id,
              client_id: quote.client_id || '',
              vehicle_id: quote.vehicle_type_id || null,
              departure_location: quote.departure_location || '',
              arrival_location: quote.arrival_location || '',
              
              // Coordonnées
              departure_coordinates: departureCoords,
              arrival_coordinates: arrivalCoords,
              return_coordinates: returnCoords,
              
              // Dates et montants
              ride_date: quote.departure_datetime || quote.created_at,
              amount: typeof quote.total_fare === 'number' ? quote.total_fare : 0,
              status: (quote.status as 'pending' | 'accepted' | 'declined' | 'rejected') || 'pending',
              quote_pdf: quote.quote_pdf || null,
              created_at: quote.created_at,
              updated_at: quote.updated_at || quote.created_at,
              
              // Détails du trajet
              distance_km: typeof quote.total_distance === 'number' ? quote.total_distance : 0,
              duration_minutes: typeof quote.outbound_duration_minutes === 'number' ? quote.outbound_duration_minutes : 0,
              has_return_trip: Boolean(quote.include_return),
              has_waiting_time: Boolean(quote.waiting_time_minutes),
              waiting_time_minutes: typeof quote.waiting_time_minutes === 'number' ? quote.waiting_time_minutes : 0,
              waiting_time_price: typeof quote.waiting_fare === 'number' ? quote.waiting_fare : 0,
              return_to_same_address: Boolean(quote.return_to_same_address),
              custom_return_address: quote.custom_return_address || '',
              return_distance_km: typeof quote.return_distance_km === 'number' ? quote.return_distance_km : 0,
              return_duration_minutes: typeof quote.return_duration_minutes === 'number' ? quote.return_duration_minutes : 0,
              
              // Tarifs spéciaux
              has_night_rate: Boolean(quote.has_night_rate),
              night_rate_percentage: typeof quote.night_rate_percentage === 'number' ? quote.night_rate_percentage : 0,
              night_hours: typeof quote.night_hours === 'number' ? quote.night_hours : 0,
              night_surcharge: typeof quote.night_surcharge === 'number' ? quote.night_surcharge : 0,
              is_sunday_holiday: Boolean(quote.is_sunday_holiday),
              sunday_holiday_percentage: typeof quote.sunday_holiday_percentage === 'number' ? quote.sunday_holiday_percentage : 0,
              sunday_holiday_surcharge: typeof quote.sunday_surcharge === 'number' ? quote.sunday_surcharge : 0,
              
              // Détails de distance
              day_km: typeof quote.day_km === 'number' ? quote.day_km : 0,
              night_km: typeof quote.night_km === 'number' ? quote.night_km : 0,
              total_km: typeof quote.total_distance === 'number' ? quote.total_distance : 0,
              
              // Prix détaillés
              day_price: typeof quote.day_price === 'number' ? quote.day_price : 0,
              night_price: typeof quote.night_price === 'number' ? quote.night_price : 0,
              
              // Temps d'attente
              wait_time_day: typeof quote.wait_time_day === 'number' ? quote.wait_time_day : 0,
              wait_time_night: typeof quote.wait_time_night === 'number' ? quote.wait_time_night : 0,
              wait_price_day: typeof quote.wait_price_day === 'number' ? quote.wait_price_day : 0,
              wait_price_night: typeof quote.wait_price_night === 'number' ? quote.wait_price_night : 0,
              
              // Montants
              amount_ht: typeof quote.base_fare === 'number' ? quote.base_fare : 0,
              total_ht: typeof quote.total_ht === 'number' ? quote.total_ht : 0,
              vat: typeof quote.vat === 'number' ? quote.vat : 0,
              total_ttc: typeof quote.total_fare === 'number' ? quote.total_fare : 0,
              
              // Prix aller-retour
              one_way_price_ht: typeof quote.one_way_price_ht === 'number' ? quote.one_way_price_ht : 0,
              one_way_price: typeof quote.one_way_price === 'number' ? quote.one_way_price : 0,
              return_price_ht: typeof quote.return_price_ht === 'number' ? quote.return_price_ht : 0,
              return_price: typeof quote.return_price === 'number' ? quote.return_price : 0,
              
              // Relations
              clients: clientData,
              vehicles: vehicleData,
              
              // Autres paramètres
              day_hours: typeof quote.day_hours === 'number' ? quote.day_hours : 0
            };
            
            return processedQuote;
          } catch (err) {
            console.error(`Erreur lors du traitement du devis ${quote.id}:`, err);
            // Continuer avec les autres devis en cas d'erreur
            return null;
          }
        }).filter(Boolean) as Quote[]; // Suppression des devis null
        
        setQuotes(processedQuotes);
        console.log('Devis traités et formatés:', processedQuotes.length);
      } catch (err: any) {
        console.error('Erreur détaillée lors de la récupération des devis:', err);
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
  
  /**
   * Rafraîchit la liste des devis
   */
  const refetch = async () => {
    setQuotes([]);
    setIsLoading(true);
    
    if (user) {
      try {
        console.log('Rafraîchissement des devis...');
        
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
        
        // Utiliser la même logique de traitement que dans l'effet
        const processedQuotes = data.map(quote => {
          try {
            // Traiter les relations
            const clientData = processClientData(quote.clients);
            const vehicleData = processVehicleData(quote.vehicles);
            
            // Traiter les coordonnées
            const departureCoords = processCoordinates(quote.departure_coordinates);
            const arrivalCoords = processCoordinates(quote.arrival_coordinates);
            const returnCoords = processCoordinates(quote.return_coordinates);
            
            return {
              // Propriétés de base
              id: quote.id,
              driver_id: quote.driver_id,
              client_id: quote.client_id || '',
              vehicle_id: quote.vehicle_type_id || null,
              departure_location: quote.departure_location || '',
              arrival_location: quote.arrival_location || '',
              
              // Coordonnées
              departure_coordinates: departureCoords,
              arrival_coordinates: arrivalCoords,
              return_coordinates: returnCoords,
              
              // Dates et montants
              ride_date: quote.departure_datetime || quote.created_at,
              amount: typeof quote.total_fare === 'number' ? quote.total_fare : 0,
              status: (quote.status as 'pending' | 'accepted' | 'declined' | 'rejected') || 'pending',
              quote_pdf: quote.quote_pdf || null,
              created_at: quote.created_at,
              updated_at: quote.updated_at || quote.created_at,
              
              // Détails du trajet
              distance_km: typeof quote.total_distance === 'number' ? quote.total_distance : 0,
              duration_minutes: typeof quote.outbound_duration_minutes === 'number' ? quote.outbound_duration_minutes : 0,
              has_return_trip: Boolean(quote.include_return),
              has_waiting_time: Boolean(quote.waiting_time_minutes),
              waiting_time_minutes: typeof quote.waiting_time_minutes === 'number' ? quote.waiting_time_minutes : 0,
              waiting_time_price: typeof quote.waiting_fare === 'number' ? quote.waiting_fare : 0,
              return_to_same_address: Boolean(quote.return_to_same_address),
              custom_return_address: quote.custom_return_address || '',
              return_distance_km: typeof quote.return_distance_km === 'number' ? quote.return_distance_km : 0,
              return_duration_minutes: typeof quote.return_duration_minutes === 'number' ? quote.return_duration_minutes : 0,
              
              // Tarifs spéciaux
              has_night_rate: Boolean(quote.has_night_rate),
              night_rate_percentage: typeof quote.night_rate_percentage === 'number' ? quote.night_rate_percentage : 0,
              night_hours: typeof quote.night_hours === 'number' ? quote.night_hours : 0,
              night_surcharge: typeof quote.night_surcharge === 'number' ? quote.night_surcharge : 0,
              is_sunday_holiday: Boolean(quote.is_sunday_holiday),
              sunday_holiday_percentage: typeof quote.sunday_holiday_percentage === 'number' ? quote.sunday_holiday_percentage : 0,
              sunday_holiday_surcharge: typeof quote.sunday_surcharge === 'number' ? quote.sunday_surcharge : 0,
              
              // Détails de distance
              day_km: typeof quote.day_km === 'number' ? quote.day_km : 0,
              night_km: typeof quote.night_km === 'number' ? quote.night_km : 0,
              total_km: typeof quote.total_distance === 'number' ? quote.total_distance : 0,
              
              // Détails de prix
              day_price: typeof quote.day_price === 'number' ? quote.day_price : 0,
              night_price: typeof quote.night_price === 'number' ? quote.night_price : 0,
              
              // Détails d'attente
              wait_time_day: typeof quote.wait_time_day === 'number' ? quote.wait_time_day : 0,
              wait_time_night: typeof quote.wait_time_night === 'number' ? quote.wait_time_night : 0,
              wait_price_day: typeof quote.wait_price_day === 'number' ? quote.wait_price_day : 0,
              wait_price_night: typeof quote.wait_price_night === 'number' ? quote.wait_price_night : 0,
              
              // Montants
              amount_ht: typeof quote.base_fare === 'number' ? quote.base_fare : 0,
              total_ht: typeof quote.total_ht === 'number' ? quote.total_ht : 0,
              vat: typeof quote.vat === 'number' ? quote.vat : 0,
              total_ttc: typeof quote.total_fare === 'number' ? quote.total_fare : 0,
              
              // Prix aller-retour
              one_way_price_ht: typeof quote.one_way_price_ht === 'number' ? quote.one_way_price_ht : 0,
              one_way_price: typeof quote.one_way_price === 'number' ? quote.one_way_price : 0,
              return_price_ht: typeof quote.return_price_ht === 'number' ? quote.return_price_ht : 0,
              return_price: typeof quote.return_price === 'number' ? quote.return_price : 0,
              
              // Relations
              clients: clientData,
              vehicles: vehicleData,
              
              // Autres paramètres
              day_hours: typeof quote.day_hours === 'number' ? quote.day_hours : 0
            } as Quote;
          } catch (err) {
            console.error(`Erreur lors du traitement du devis ${quote.id}:`, err);
            // Continuer avec les autres devis en cas d'erreur
            return null;
          }
        }).filter(Boolean) as Quote[]; // Suppression des devis null
        
        setQuotes(processedQuotes);
        console.log('Devis rafraîchis:', processedQuotes.length);
      } catch (err: any) {
        console.error('Erreur détaillée lors du rafraîchissement des devis:', err);
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
