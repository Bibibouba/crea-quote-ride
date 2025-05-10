
import { quoteValidator, testQuoteValidation } from '@/services/quote/utils/quoteValidator';
import { Quote } from '@/types/quote';

/**
 * Fichier de tests unitaires pour le système de validation des devis
 * 
 * Pour exécuter ces tests, vous pouvez utiliser:
 * - Un framework de test comme Jest ou Vitest
 * - Ou les exécuter manuellement via les fonctions ci-dessous
 */

// Test pour la validation d'un devis complet
const testValidQuote = () => {
  const validQuote: Quote = {
    id: '123',
    driver_id: '456',
    client_id: '789',
    vehicle_id: 'abc',
    departure_location: 'Paris',
    arrival_location: 'Lyon',
    ride_date: new Date().toISOString(),
    amount: 150,
    status: 'pending',
    quote_pdf: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    distance_km: 450,
    duration_minutes: 240
  };
  
  const isValid = quoteValidator.isValidQuote(validQuote);
  console.assert(isValid === true, 'Un devis valide devrait passer la validation');
  console.log('Test devis valide:', isValid ? 'RÉUSSI' : 'ÉCHOUÉ');
  return isValid;
};

// Test pour la validation d'un devis incomplet
const testInvalidQuote = () => {
  const invalidQuote = {
    id: '123',
    driver_id: '456'
    // Propriétés obligatoires manquantes
  };
  
  const isValid = quoteValidator.isValidQuote(invalidQuote);
  console.assert(isValid === false, 'Un devis incomplet ne devrait pas passer la validation');
  console.log('Test devis invalide:', !isValid ? 'RÉUSSI' : 'ÉCHOUÉ');
  return !isValid;
};

// Test pour la transformation des données
const testQuoteTransformation = () => {
  const dbData = {
    id: '123',
    driver_id: '456',
    client_id: '789',
    vehicle_type_id: 'abc',
    departure_location: 'Paris',
    arrival_location: 'Lyon',
    departure_datetime: '2025-01-01T12:00:00Z',
    total_fare: 150,
    status: 'pending',
    created_at: '2024-12-01T12:00:00Z',
    total_distance: 450,
    outbound_duration_minutes: 240
  };
  
  const transformedQuote = quoteValidator.fromDatabase(dbData);
  const isValid = quoteValidator.isValidQuote(transformedQuote);
  
  console.assert(isValid === true, 'La transformation devrait produire un devis valide');
  console.assert(transformedQuote.ride_date === dbData.departure_datetime, 
    'La transformation devrait mapper correctement les champs');
  
  console.log('Test transformation:', isValid ? 'RÉUSSI' : 'ÉCHOUÉ');
  return isValid;
};

// Exécution des tests
export const runQuoteTests = () => {
  console.log('=== DÉBUT DES TESTS DE VALIDATION DES DEVIS ===');
  
  const results = [
    testValidQuote(),
    testInvalidQuote(),
    testQuoteTransformation()
  ];
  
  const allPassed = results.every(result => result === true);
  console.log('=== FIN DES TESTS ===');
  console.log(`Résultat: ${allPassed ? 'TOUS LES TESTS ONT RÉUSSI' : 'CERTAINS TESTS ONT ÉCHOUÉ'}`);
  
  // Pour exécuter ce test manuellement, vous pouvez importer runQuoteTests
  // et l'appeler depuis la console du navigateur ou un autre fichier
};
