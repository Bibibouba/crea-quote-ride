
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { quotesLogger } from './quotesLogger';
import { validateQuoteStatus } from '@/services/quote/utils/validateQuoteStatus';

/**
 * Interface pour les paramètres de création d'un devis dans la base de données
 */
export interface CreateQuoteDbParams {
  driverId: string;
  clientId: string;
  quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf" | "vehicles" | "clients">;
}

/**
 * Insère un nouveau devis dans la base de données et retourne l'objet complet
 * @param params Les paramètres pour la création du devis
 * @returns Le devis créé avec toutes ses propriétés
 */
export const createQuoteInDb = async ({ 
  driverId, 
  clientId, 
  quoteData 
}: CreateQuoteDbParams): Promise<Quote> => {
  quotesLogger.info("Préparation de l'insertion en base de données");
  
  // Préparation des données pour la table quotes avec les champs correspondants
  const quotePrepared = {
    driver_id: driverId,
    client_id: clientId,
    vehicle_type_id: quoteData.vehicle_id,
    departure_datetime: quoteData.ride_date,
    departure_location: quoteData.departure_location,
    arrival_location: quoteData.arrival_location,
    departure_coordinates: quoteData.departure_coordinates,
    arrival_coordinates: quoteData.arrival_coordinates,
    total_distance: quoteData.distance_km,
    outbound_duration_minutes: quoteData.duration_minutes,
    include_return: quoteData.has_return_trip,
    waiting_time_minutes: quoteData.waiting_time_minutes,
    waiting_fare: quoteData.waiting_time_price,
    night_surcharge: quoteData.night_surcharge,
    sunday_surcharge: quoteData.sunday_holiday_surcharge,
    holiday_surcharge: 0, // Non utilisé pour l'instant
    base_fare: quoteData.amount_ht,
    total_fare: quoteData.total_ttc || quoteData.amount,
    status: validateQuoteStatus(quoteData.status), // Utiliser validateQuoteStatus pour garantir une valeur valide
    return_coordinates: quoteData.return_coordinates,
    return_to_same_address: quoteData.return_to_same_address,
    custom_return_address: quoteData.custom_return_address,
    return_distance_km: quoteData.return_distance_km,
    return_duration_minutes: quoteData.return_duration_minutes
  };
  
  quotesLogger.debug("Données préparées pour l'insertion:", quotePrepared);
    
  const { data, error } = await supabase
    .from('quotes')
    .insert(quotePrepared)
    .select();
    
  if (error) {
    quotesLogger.error('Erreur lors de la création du devis dans la base de données:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error("Aucune donnée retournée lors de la création du devis");
  }
  
  quotesLogger.debug("Données retournées après insertion:", data[0]);
  
  // Transformer les données brutes en type Quote complet
  const quote: Quote = {
    id: data[0].id,
    driver_id: data[0].driver_id,
    client_id: clientId,
    vehicle_id: data[0].vehicle_type_id,
    departure_location: quoteData.departure_location,
    arrival_location: quoteData.arrival_location,
    departure_coordinates: quoteData.departure_coordinates,
    arrival_coordinates: quoteData.arrival_coordinates,
    ride_date: data[0].departure_datetime,
    amount: data[0].total_fare,
    status: validateQuoteStatus(data[0].status), // Utiliser validateQuoteStatus pour garantir une valeur valide
    quote_pdf: null,
    created_at: data[0].created_at,
    updated_at: data[0].created_at,
    distance_km: data[0].total_distance,
    duration_minutes: data[0].outbound_duration_minutes,
    has_return_trip: data[0].include_return,
    has_waiting_time: !!data[0].waiting_time_minutes,
    waiting_time_minutes: data[0].waiting_time_minutes,
    waiting_time_price: data[0].waiting_fare,
    night_surcharge: data[0].night_surcharge,
    sunday_holiday_surcharge: data[0].sunday_surcharge,
    amount_ht: quoteData.amount_ht,
    total_ttc: quoteData.total_ttc,
    
    // Ajout des autres propriétés du Quote
    return_to_same_address: quoteData.return_to_same_address,
    custom_return_address: quoteData.custom_return_address,
    return_coordinates: quoteData.return_coordinates,
    return_distance_km: quoteData.return_distance_km,
    return_duration_minutes: quoteData.return_duration_minutes,
    has_night_rate: quoteData.has_night_rate,
    night_rate_percentage: quoteData.night_rate_percentage,
    night_hours: quoteData.night_hours,
    is_sunday_holiday: quoteData.is_sunday_holiday,
    sunday_holiday_percentage: quoteData.sunday_holiday_percentage,
    day_km: quoteData.day_km,
    night_km: quoteData.night_km,
    total_km: quoteData.total_km,
    day_price: quoteData.day_price,
    night_price: quoteData.night_price,
    wait_time_day: quoteData.wait_time_day,
    wait_time_night: quoteData.wait_time_night,
    wait_price_day: quoteData.wait_price_day,
    wait_price_night: quoteData.wait_price_night,
    one_way_price_ht: quoteData.one_way_price_ht,
    one_way_price: quoteData.one_way_price,
    return_price_ht: quoteData.return_price_ht,
    return_price: quoteData.return_price,
    vat: quoteData.vat,
    total_ht: quoteData.total_ht,
    day_hours: quoteData.day_hours,
    
    // Relations (null par défaut)
    vehicles: null,
    clients: null
  };
  
  quotesLogger.info("Devis créé avec succès:", { id: quote.id });
  return quote;
};
