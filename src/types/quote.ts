
/**
 * Type définissant un devis complet dans l'application
 * Cette interface décrit toutes les propriétés d'un devis, y compris
 * les informations de base, les détails du trajet, les calculs de prix,
 * et les relations avec les clients et véhicules
 */
export type Quote = {
  // Propriétés de base (obligatoires)
  id: string;                    // Identifiant unique du devis
  driver_id: string;             // Identifiant du chauffeur ayant créé le devis
  client_id: string;             // Identifiant du client concerné par le devis
  departure_location: string;    // Adresse de départ
  arrival_location: string;      // Adresse d'arrivée
  ride_date: string;             // Date et heure du trajet (format ISO)
  amount: number;                // Montant total du devis
  status: 'pending' | 'accepted' | 'declined' | 'rejected' | 'expired';  // Statut du devis
  created_at: string;            // Date de création du devis
  updated_at: string;            // Date de dernière modification du devis
  
  // Propriétés obligatoires avec valeurs nullables
  quote_pdf: string | null;      // URL du PDF du devis (null si non généré)
  vehicle_id: string | null;     // Identifiant du véhicule sélectionné (peut être null)
  
  // Propriétés liées au trajet (optionnelles)
  distance_km?: number;          // Distance en kilomètres
  duration_minutes?: number;     // Durée estimée en minutes
  has_return_trip?: boolean;     // Indique si le trajet comprend un retour
  has_waiting_time?: boolean;    // Indique si un temps d'attente est prévu
  waiting_time_minutes?: number; // Durée du temps d'attente en minutes
  waiting_time_price?: number;   // Prix du temps d'attente
  
  // Propriétés pour les coordonnées (optionnelles)
  departure_coordinates?: [number, number];  // Coordonnées [lat, lng] du point de départ
  arrival_coordinates?: [number, number];    // Coordonnées [lat, lng] du point d'arrivée
  return_coordinates?: [number, number];     // Coordonnées [lat, lng] du point de retour
  
  // Propriétés pour les informations de retour (optionnelles)
  return_to_same_address?: boolean;      // Retour à la même adresse que le départ
  custom_return_address?: string;        // Adresse personnalisée pour le retour
  return_distance_km?: number;           // Distance de retour en kilomètres
  return_duration_minutes?: number;      // Durée estimée du retour en minutes
  
  // Propriétés pour les tarifs spéciaux (optionnelles)
  night_surcharge?: number;              // Majoration pour tarif de nuit
  sunday_holiday_surcharge?: number;     // Majoration pour dimanche/jour férié
  amount_ht?: number;                    // Montant hors taxes
  total_ttc?: number;                    // Montant TTC
  
  // Propriétés pour les informations de temps (optionnelles)
  night_hours?: number;                  // Nombre d'heures de nuit
  day_hours?: number;                    // Nombre d'heures de jour
  has_night_rate?: boolean;              // Application du tarif de nuit
  night_rate_percentage?: number;        // Pourcentage de majoration pour tarif de nuit
  
  // Propriétés pour les informations de prix (optionnelles)
  day_km?: number;                       // Kilomètres parcourus en journée
  night_km?: number;                     // Kilomètres parcourus de nuit
  total_km?: number;                     // Kilométrage total
  day_price?: number;                    // Prix pour les kilomètres en journée
  night_price?: number;                  // Prix pour les kilomètres de nuit
  is_sunday_holiday?: boolean;           // Indique si le trajet est un dimanche ou jour férié
  sunday_holiday_percentage?: number;    // Pourcentage de majoration pour dimanche/jour férié
  
  // Propriétés pour les informations d'attente (optionnelles)
  wait_time_day?: number;                // Temps d'attente en journée (minutes)
  wait_time_night?: number;              // Temps d'attente de nuit (minutes)
  wait_price_day?: number;               // Prix du temps d'attente en journée
  wait_price_night?: number;             // Prix du temps d'attente de nuit
  
  // Propriétés pour les prix détaillés (optionnelles)
  one_way_price_ht?: number;             // Prix HT pour l'aller
  one_way_price?: number;                // Prix TTC pour l'aller
  return_price_ht?: number;              // Prix HT pour le retour
  return_price?: number;                 // Prix TTC pour le retour
  vat?: number;                          // Montant de TVA
  total_ht?: number;                     // Total hors taxes
  
  // Relations (optionnelles avec types spécifiques)
  clients?: {                            // Informations sur le client
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  
  vehicles?: {                           // Informations sur le véhicule
    name: string;
    model: string;
    basePrice: number;
  } | null;
};
