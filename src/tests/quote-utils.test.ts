
import { isValidObject, processClientData, processVehicleData, processCoordinates } from '@/hooks/quote/utils/quoteDataProcessors';
import { transformQuote } from '@/hooks/quote/utils/quoteTransformer';

/**
 * Tests unitaires pour les fonctions d'utilitaires de traitement des devis
 */

// Test pour la fonction isValidObject
export const testIsValidObject = () => {
  console.log('=== TEST: isValidObject ===');
  
  // Test avec un objet valide
  const validObject = { id: 1, name: 'test' };
  console.assert(isValidObject(validObject) === true, 'Un objet valide doit retourner true');
  
  // Test avec null
  console.assert(isValidObject(null) === false, 'null doit retourner false');
  
  // Test avec un tableau
  console.assert(isValidObject([1, 2, 3]) === false, 'Un tableau doit retourner false');
  
  // Test avec un objet contenant une erreur
  console.assert(isValidObject({ error: 'Erreur' }) === false, 'Un objet avec error doit retourner false');
  
  console.log('Tests isValidObject terminés');
};

// Test pour la fonction processClientData
export const testProcessClientData = () => {
  console.log('=== TEST: processClientData ===');
  
  // Test avec des données client valides
  const validClient = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '123456789'
  };
  
  const processedClient = processClientData(validClient);
  console.assert(processedClient !== null, 'Le client traité ne doit pas être null');
  console.assert(processedClient?.first_name === 'John', 'Le prénom doit être conservé');
  console.assert(processedClient?.email === 'john@example.com', 'L\'email doit être conservé');
  
  // Test avec des données client invalides
  console.assert(processClientData(null) === null, 'Les données client null doivent retourner null');
  console.assert(processClientData({ error: 'Invalid' }) === null, 
    'Les données client avec erreur doivent retourner null');
  
  // Test avec des données partielles
  const partialClient = { first_name: 'Jane' };
  const processedPartial = processClientData(partialClient);
  console.assert(processedPartial?.first_name === 'Jane', 'Le prénom doit être conservé');
  console.assert(processedPartial?.last_name === '', 'Le nom manquant doit être une chaîne vide');
  
  console.log('Tests processClientData terminés');
};

// Tests pour la fonction processVehicleData
export const testProcessVehicleData = () => {
  console.log('=== TEST: processVehicleData ===');
  
  // Test avec des données valides
  const validVehicle = {
    name: 'Berline',
    model: 'S500',
    base_price: 100
  };
  
  const processedVehicle = processVehicleData(validVehicle);
  console.assert(processedVehicle !== null, 'Le véhicule traité ne doit pas être null');
  console.assert(processedVehicle?.name === 'Berline', 'Le nom doit être conservé');
  console.assert(processedVehicle?.basePrice === 100, 'Le prix de base doit être conservé');
  
  // Test avec des données invalides
  console.assert(processVehicleData(null) === null, 'Les données véhicule null doivent retourner null');
  
  // Test avec données partielles
  const partialVehicle = { name: 'Van' };
  const processedPartial = processVehicleData(partialVehicle);
  console.assert(processedPartial?.name === 'Van', 'Le nom doit être conservé');
  console.assert(processedPartial?.model === '', 'Le modèle manquant doit être une chaîne vide');
  console.assert(processedPartial?.basePrice === 0, 'Le prix manquant doit être 0');
  
  console.log('Tests processVehicleData terminés');
};

// Tests pour transformer un devis
export const testTransformQuote = () => {
  console.log('=== TEST: transformQuote ===');
  
  const rawQuoteData = {
    id: 'quote123',
    driver_id: 'driver123',
    client_id: 'client123',
    vehicle_type_id: 'vehicle123',
    departure_location: 'Paris',
    arrival_location: 'Lyon',
    departure_datetime: '2025-01-01T12:00:00Z',
    departure_coordinates: [2.35, 48.85],
    arrival_coordinates: [4.85, 45.75],
    total_distance: 450,
    outbound_duration_minutes: 240,
    include_return: true,
    waiting_time_minutes: 30,
    waiting_fare: 15,
    total_fare: 500,
    base_fare: 420,
    night_surcharge: 50,
    sunday_surcharge: 30,
    status: 'pending',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
    clients: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '123456789'
    },
    vehicles: {
      name: 'Berline',
      model: 'S500',
      base_price: 100
    }
  };
  
  try {
    const transformedQuote = transformQuote(rawQuoteData);
    
    // Vérifications des propriétés de base
    console.assert(transformedQuote.id === 'quote123', 'L\'ID doit être préservé');
    console.assert(transformedQuote.departure_location === 'Paris', 'Le lieu de départ doit être préservé');
    console.assert(transformedQuote.has_return_trip === true, 'Le retour doit être true');
    
    // Vérifications des propriétés complexes
    console.assert(transformedQuote.clients !== null, 'Les infos client doivent être présentes');
    console.assert(transformedQuote.vehicles !== null, 'Les infos véhicule doivent être présentes');
    console.assert(transformedQuote.clients?.first_name === 'John', 'Le prénom client doit être préservé');
    
    // Vérifications des coordonnées
    console.assert(transformedQuote.departure_coordinates !== undefined, 'Les coordonnées de départ doivent être présentes');
    console.assert(transformedQuote.departure_coordinates?.[0] === 2.35, 'La latitude de départ doit être préservée');
    
    console.log('Transformation réussie');
  } catch (error) {
    console.error('Erreur dans le test de transformation:', error);
    console.assert(false, 'La transformation ne devrait pas échouer');
  }
  
  // Test avec données manquantes
  const minimalData = {
    id: 'quote456',
    driver_id: 'driver123',
    created_at: '2024-01-01T10:00:00Z'
  };
  
  try {
    const transformedMinimal = transformQuote(minimalData);
    console.assert(transformedMinimal.id === 'quote456', 'L\'ID doit être préservé même avec données minimales');
    console.assert(transformedMinimal.departure_location === '', 'Le lieu de départ doit avoir une valeur par défaut');
    console.log('Transformation avec données minimales réussie');
  } catch (error) {
    console.error('Erreur dans le test de transformation minimale:', error);
    console.assert(false, 'La transformation minimale ne devrait pas échouer');
  }
  
  console.log('Tests transformQuote terminés');
};

// Exécution des tests
export const runQuoteUtilsTests = () => {
  console.log('=== DÉBUT DES TESTS DES UTILITAIRES DE DEVIS ===');
  
  testIsValidObject();
  testProcessClientData();
  testProcessVehicleData();
  testTransformQuote();
  
  console.log('=== FIN DES TESTS ===');
};
