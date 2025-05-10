
import { Quote } from '@/types/quote';

/**
 * Vérifie si un objet est valide (n'est pas null, n'est pas un tableau, et n'est pas une erreur)
 * @param obj L'objet à vérifier
 * @returns true si l'objet est valide, false sinon
 */
export const isValidObject = (obj: any): boolean => {
  return obj && 
         typeof obj === 'object' && 
         !Array.isArray(obj) && 
         !("error" in obj);
};

/**
 * Traite les données du client pour correspondre au format attendu
 * @param clientData Les données brutes du client
 * @returns Les données formatées du client ou null en cas d'erreur
 */
export const processClientData = (clientData: any) => {
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

/**
 * Traite les données du véhicule pour correspondre au format attendu
 * @param vehicleData Les données brutes du véhicule
 * @returns Les données formatées du véhicule ou null en cas d'erreur
 */
export const processVehicleData = (vehicleData: any) => {
  if (!isValidObject(vehicleData)) {
    return null;
  }
  
  return {
    name: vehicleData.name || "Véhicule inconnu",
    model: vehicleData.model || "",
    basePrice: typeof vehicleData.base_price === 'number' ? vehicleData.base_price : 0
  };
};

/**
 * Convertit un tableau de coordonnées au format attendu
 * @param coords Les coordonnées brutes
 * @returns Les coordonnées formatées ou undefined si invalides
 */
export const processCoordinates = (coords: any): [number, number] | undefined => {
  if (coords && Array.isArray(coords) && coords.length === 2) {
    return coords as [number, number];
  }
  return undefined;
};

/**
 * Extrait une valeur numérique d'un objet, avec valeur par défaut
 * @param obj L'objet source
 * @param key La clé à extraire
 * @param defaultValue Valeur par défaut si non trouvée ou invalide
 * @returns La valeur numérique ou la valeur par défaut
 */
export const getNumericValue = (obj: any, key: string, defaultValue: number = 0): number => {
  if (!obj || typeof obj[key] !== 'number') {
    return defaultValue;
  }
  return obj[key];
};

/**
 * Extrait une valeur booléenne d'un objet
 * @param obj L'objet source
 * @param key La clé à extraire
 * @returns La valeur booléenne (false par défaut si non trouvée)
 */
export const getBooleanValue = (obj: any, key: string): boolean => {
  return Boolean(obj?.[key]);
};

/**
 * Extrait une valeur string d'un objet, avec valeur par défaut
 * @param obj L'objet source
 * @param key La clé à extraire
 * @param defaultValue Valeur par défaut si non trouvée ou invalide
 * @returns La valeur string ou la valeur par défaut
 */
export const getStringValue = (obj: any, key: string, defaultValue: string = ''): string => {
  if (!obj || typeof obj[key] !== 'string') {
    return defaultValue;
  }
  return obj[key];
};
