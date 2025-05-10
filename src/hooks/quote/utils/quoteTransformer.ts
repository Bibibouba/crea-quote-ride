
import { Quote } from '@/types/quote';
import { 
  processClientData, 
  processVehicleData, 
  processCoordinates,
  getNumericValue,
  getBooleanValue,
  getStringValue
} from './quoteDataProcessors';

/**
 * Transforme les données brutes d'un devis en un objet Quote correctement typé
 * @param quoteData Les données brutes du devis
 * @returns Un objet Quote complet et correctement typé
 */
export const transformQuote = (quoteData: any): Quote => {
  try {
    // Traiter les relations clients et véhicules
    const clientData = processClientData(quoteData.clients);
    const vehicleData = processVehicleData(quoteData.vehicles);
    
    // Traiter les coordonnées
    const departureCoords = processCoordinates(quoteData.departure_coordinates);
    const arrivalCoords = processCoordinates(quoteData.arrival_coordinates);
    const returnCoords = processCoordinates(quoteData.return_coordinates);
    
    // Construire l'objet Quote complet avec toutes les propriétés requises
    const quote: Quote = {
      // Propriétés de base
      id: quoteData.id,
      driver_id: quoteData.driver_id,
      client_id: getStringValue(quoteData, 'client_id'),
      vehicle_id: quoteData.vehicle_type_id || null,
      departure_location: getStringValue(quoteData, 'departure_location'),
      arrival_location: getStringValue(quoteData, 'arrival_location'),
      
      // Coordonnées
      departure_coordinates: departureCoords,
      arrival_coordinates: arrivalCoords,
      return_coordinates: returnCoords,
      
      // Dates et montants
      ride_date: quoteData.departure_datetime || quoteData.created_at,
      amount: getNumericValue(quoteData, 'total_fare'),
      status: (quoteData.status as 'pending' | 'accepted' | 'declined' | 'rejected' | 'expired') || 'pending',
      quote_pdf: quoteData.quote_pdf || null,
      created_at: quoteData.created_at,
      updated_at: quoteData.updated_at || quoteData.created_at,
      
      // Détails du trajet
      distance_km: getNumericValue(quoteData, 'total_distance'),
      duration_minutes: getNumericValue(quoteData, 'outbound_duration_minutes'),
      has_return_trip: getBooleanValue(quoteData, 'include_return'),
      has_waiting_time: getBooleanValue(quoteData, 'waiting_time_minutes'),
      waiting_time_minutes: getNumericValue(quoteData, 'waiting_time_minutes'),
      waiting_time_price: getNumericValue(quoteData, 'waiting_fare'),
      
      // Propriétés de retour
      return_to_same_address: getBooleanValue(quoteData, 'return_to_same_address'),
      custom_return_address: getStringValue(quoteData, 'custom_return_address'),
      return_distance_km: getNumericValue(quoteData, 'return_distance_km'),
      return_duration_minutes: getNumericValue(quoteData, 'return_duration_minutes'),
      
      // Tarifs spéciaux
      has_night_rate: getBooleanValue(quoteData, 'has_night_rate'),
      night_rate_percentage: getNumericValue(quoteData, 'night_rate_percentage'),
      night_hours: getNumericValue(quoteData, 'night_hours'),
      night_surcharge: getNumericValue(quoteData, 'night_surcharge'),
      is_sunday_holiday: getBooleanValue(quoteData, 'is_sunday_holiday'),
      sunday_holiday_percentage: getNumericValue(quoteData, 'sunday_holiday_percentage'),
      sunday_holiday_surcharge: getNumericValue(quoteData, 'sunday_surcharge'),
      
      // Détails de distance
      day_km: getNumericValue(quoteData, 'day_km'),
      night_km: getNumericValue(quoteData, 'night_km'),
      total_km: getNumericValue(quoteData, 'total_distance'),
      
      // Prix détaillés
      day_price: getNumericValue(quoteData, 'day_price'),
      night_price: getNumericValue(quoteData, 'night_price'),
      
      // Temps d'attente
      wait_time_day: getNumericValue(quoteData, 'wait_time_day'),
      wait_time_night: getNumericValue(quoteData, 'wait_time_night'),
      wait_price_day: getNumericValue(quoteData, 'wait_price_day'),
      wait_price_night: getNumericValue(quoteData, 'wait_price_night'),
      
      // Montants
      amount_ht: getNumericValue(quoteData, 'base_fare'),
      total_ht: getNumericValue(quoteData, 'total_ht'),
      vat: getNumericValue(quoteData, 'vat'),
      total_ttc: getNumericValue(quoteData, 'total_fare'),
      
      // Prix aller-retour
      one_way_price_ht: getNumericValue(quoteData, 'one_way_price_ht'),
      one_way_price: getNumericValue(quoteData, 'one_way_price'),
      return_price_ht: getNumericValue(quoteData, 'return_price_ht'),
      return_price: getNumericValue(quoteData, 'return_price'),
      
      // Relations
      clients: clientData,
      vehicles: vehicleData,
      
      // Autres paramètres
      day_hours: getNumericValue(quoteData, 'day_hours')
    };
    
    return quote;
  } catch (error) {
    console.error('Erreur lors de la transformation du devis:', error);
    throw new Error(`Erreur de transformation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};
