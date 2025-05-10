
import { prepareQuoteData } from '../prepareQuoteData';
import { validateQuoteData } from '../validateQuoteData';

/**
 * Tests unitaires pour les utilitaires du créateur de devis
 */
describe('Quote Creator Utilities', () => {
  
  describe('prepareQuoteData', () => {
    test('should correctly prepare quote data with valid inputs', () => {
      const mockDateTime = new Date('2023-01-01T12:00:00Z');
      const mockQuoteDetails = {
        totalPrice: 100,
        totalPriceHT: 90,
        dayKm: 80,
        nightKm: 20,
        totalKm: 100
      };
      
      const result = prepareQuoteData({
        driverId: 'driver123',
        clientId: 'client123',
        selectedVehicle: 'vehicle123',
        departureAddress: 'Paris',
        destinationAddress: 'Lyon',
        departureCoordinates: [48.856614, 2.3522219],
        destinationCoordinates: [45.764043, 4.835659],
        dateTime: mockDateTime,
        estimatedDistance: 100,
        estimatedDuration: 120,
        quoteDetails: mockQuoteDetails,
        hasReturnTrip: false,
        hasWaitingTime: false,
        waitingTimeMinutes: 0,
        waitingTimePrice: 0,
        returnToSameAddress: false,
        customReturnAddress: '',
        returnDistance: 0,
        returnDuration: 0
      });
      
      expect(result).toMatchObject({
        driver_id: 'driver123',
        client_id: 'client123',
        vehicle_id: 'vehicle123',
        departure_location: 'Paris',
        arrival_location: 'Lyon',
        amount: 100,
        status: 'pending'
      });
    });
    
    test('should throw error when quoteDetails is missing', () => {
      expect(() => {
        prepareQuoteData({
          driverId: 'driver123',
          clientId: 'client123',
          selectedVehicle: 'vehicle123',
          departureAddress: 'Paris',
          destinationAddress: 'Lyon',
          dateTime: new Date(),
          estimatedDistance: 100,
          estimatedDuration: 120,
          quoteDetails: null as any,
          hasReturnTrip: false,
          hasWaitingTime: false,
          waitingTimeMinutes: 0,
          waitingTimePrice: 0,
          returnToSameAddress: false,
          customReturnAddress: '',
          returnDistance: 0,
          returnDuration: 0
        });
      }).toThrow('Les détails du devis sont obligatoires');
    });
  });
  
  describe('validateQuoteData', () => {
    test('should return true for valid data', () => {
      const isValid = validateQuoteData({
        clientId: 'client123',
        driverId: 'driver123',
        quoteDetails: { totalPrice: 100 } as any,
        selectedVehicle: 'vehicle123',
        departureAddress: 'Paris',
        destinationAddress: 'Lyon'
      });
      
      expect(isValid).toBe(true);
    });
    
    test('should return false when clientId is missing', () => {
      const isValid = validateQuoteData({
        clientId: '',
        driverId: 'driver123',
        quoteDetails: { totalPrice: 100 } as any,
        selectedVehicle: 'vehicle123',
        departureAddress: 'Paris',
        destinationAddress: 'Lyon'
      });
      
      expect(isValid).toBe(false);
    });
    
    test('should return false when quoteDetails is null', () => {
      const isValid = validateQuoteData({
        clientId: 'client123',
        driverId: 'driver123',
        quoteDetails: null,
        selectedVehicle: 'vehicle123',
        departureAddress: 'Paris',
        destinationAddress: 'Lyon'
      });
      
      expect(isValid).toBe(false);
    });
  });
});
