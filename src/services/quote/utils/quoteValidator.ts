
import { Quote } from '@/types/quote';

/**
 * Validateur pour les objets Quote
 * Fournit des fonctions utilitaires pour valider et transformer les données de devis
 */
export const quoteValidator = {
  /**
   * Vérifie si un devis contient toutes les propriétés obligatoires
   * @param quote - L'objet devis à valider
   * @returns True si le devis est valide, false sinon
   */
  isValidQuote: (quote: any): boolean => {
    if (!quote) return false;
    
    // Vérification des champs obligatoires
    const requiredFields = [
      'id', 'driver_id', 'client_id', 'departure_location',
      'arrival_location', 'ride_date', 'amount', 'status',
      'created_at', 'updated_at'
    ];
    
    for (const field of requiredFields) {
      if (quote[field] === undefined || quote[field] === null) {
        console.error(`Champ obligatoire manquant dans le devis: ${field}`);
        return false;
      }
    }
    
    return true;
  },
  
  /**
   * Nettoie un objet devis en remplissant les valeurs manquantes avec des valeurs par défaut
   * @param quote - L'objet devis à nettoyer
   * @returns Un objet devis valide avec toutes les propriétés nécessaires
   */
  sanitizeQuote: (quote: Partial<Quote>): Quote => {
    const now = new Date().toISOString();
    
    return {
      // Propriétés obligatoires avec valeurs par défaut si manquantes
      id: quote.id || 'temporaire',
      driver_id: quote.driver_id || '',
      client_id: quote.client_id || '',
      departure_location: quote.departure_location || '',
      arrival_location: quote.arrival_location || '',
      ride_date: quote.ride_date || now,
      amount: typeof quote.amount === 'number' ? quote.amount : 0,
      status: quote.status || 'pending',
      created_at: quote.created_at || now,
      updated_at: quote.updated_at || now,
      
      // Propriétés nullables
      quote_pdf: quote.quote_pdf || null,
      vehicle_id: quote.vehicle_id || null,
      
      // Propriétés optionnelles avec valeurs par défaut
      distance_km: typeof quote.distance_km === 'number' ? quote.distance_km : 0,
      duration_minutes: typeof quote.duration_minutes === 'number' ? quote.duration_minutes : 0,
      has_return_trip: Boolean(quote.has_return_trip),
      has_waiting_time: Boolean(quote.has_waiting_time),
      waiting_time_minutes: typeof quote.waiting_time_minutes === 'number' ? quote.waiting_time_minutes : 0,
      waiting_time_price: typeof quote.waiting_time_price === 'number' ? quote.waiting_time_price : 0,
      night_surcharge: typeof quote.night_surcharge === 'number' ? quote.night_surcharge : 0,
      sunday_holiday_surcharge: typeof quote.sunday_holiday_surcharge === 'number' ? quote.sunday_holiday_surcharge : 0,
      amount_ht: typeof quote.amount_ht === 'number' ? quote.amount_ht : 0,
      total_ttc: typeof quote.total_ttc === 'number' ? quote.total_ttc : 0,
      
      // Propriétés pour les coordonnées
      departure_coordinates: quote.departure_coordinates,
      arrival_coordinates: quote.arrival_coordinates,
      return_coordinates: quote.return_coordinates,
      
      // Propriétés pour les informations de retour
      return_to_same_address: Boolean(quote.return_to_same_address),
      custom_return_address: quote.custom_return_address || '',
      return_distance_km: typeof quote.return_distance_km === 'number' ? quote.return_distance_km : 0,
      return_duration_minutes: typeof quote.return_duration_minutes === 'number' ? quote.return_duration_minutes : 0,
      
      // Propriétés pour les informations de temps
      night_hours: typeof quote.night_hours === 'number' ? quote.night_hours : 0,
      day_hours: typeof quote.day_hours === 'number' ? quote.day_hours : 0,
      has_night_rate: Boolean(quote.has_night_rate),
      night_rate_percentage: typeof quote.night_rate_percentage === 'number' ? quote.night_rate_percentage : 0,
      
      // Propriétés pour les informations de prix
      day_km: typeof quote.day_km === 'number' ? quote.day_km : 0,
      night_km: typeof quote.night_km === 'number' ? quote.night_km : 0,
      total_km: typeof quote.total_km === 'number' ? quote.total_km : 0,
      day_price: typeof quote.day_price === 'number' ? quote.day_price : 0,
      night_price: typeof quote.night_price === 'number' ? quote.night_price : 0,
      is_sunday_holiday: Boolean(quote.is_sunday_holiday),
      sunday_holiday_percentage: typeof quote.sunday_holiday_percentage === 'number' ? quote.sunday_holiday_percentage : 0,
      
      // Propriétés pour les informations de temps d'attente
      wait_time_day: typeof quote.wait_time_day === 'number' ? quote.wait_time_day : 0,
      wait_time_night: typeof quote.wait_time_night === 'number' ? quote.wait_time_night : 0,
      wait_price_day: typeof quote.wait_price_day === 'number' ? quote.wait_price_day : 0,
      wait_price_night: typeof quote.wait_price_night === 'number' ? quote.wait_price_night : 0,
      
      // Propriétés pour les prix détaillés
      one_way_price_ht: typeof quote.one_way_price_ht === 'number' ? quote.one_way_price_ht : 0,
      one_way_price: typeof quote.one_way_price === 'number' ? quote.one_way_price : 0,
      return_price_ht: typeof quote.return_price_ht === 'number' ? quote.return_price_ht : 0,
      return_price: typeof quote.return_price === 'number' ? quote.return_price : 0,
      vat: typeof quote.vat === 'number' ? quote.vat : 0,
      total_ht: typeof quote.total_ht === 'number' ? quote.total_ht : 0,
      
      // Relations
      clients: quote.clients || null,
      vehicles: quote.vehicles || null
    };
  },
  
  /**
   * Convertit les données de la base de données en objet Quote
   * @param dbData - Les données brutes de la base de données
   * @returns Un objet Quote valide
   */
  fromDatabase: (dbData: any): Quote => {
    // Préparation de l'objet avec les valeurs par défaut et les conversions nécessaires
    const quotePartial: Partial<Quote> = {
      id: dbData.id,
      driver_id: dbData.driver_id,
      client_id: dbData.client_id,
      vehicle_id: dbData.vehicle_type_id,
      departure_location: dbData.departure_location,
      arrival_location: dbData.arrival_location,
      ride_date: dbData.departure_datetime || dbData.created_at,
      amount: typeof dbData.total_fare === 'number' ? dbData.total_fare : 0,
      status: dbData.status || 'pending',
      created_at: dbData.created_at,
      updated_at: dbData.updated_at || dbData.created_at,
      
      // Ajoutez d'autres mappings spécifiques ici
    };
    
    // Utilisation de la fonction sanitizeQuote pour compléter et valider l'objet
    return quoteValidator.sanitizeQuote(quotePartial);
  }
};

// Exemple d'utilisation du validateur pour les tests
export const testQuoteValidation = () => {
  // Exemple de devis invalide
  const invalidQuote = {
    id: '123',
    // Manque plusieurs propriétés obligatoires
  };
  
  console.log('Devis invalide test:', quoteValidator.isValidQuote(invalidQuote));
  
  // Exemple de devis valide après nettoyage
  const cleanedQuote = quoteValidator.sanitizeQuote(invalidQuote);
  console.log('Devis nettoyé valide:', quoteValidator.isValidQuote(cleanedQuote));
  
  return cleanedQuote;
};
