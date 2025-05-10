
import { useToast } from '@/hooks/use-toast';
import { quoteService } from '@/services/quote/quoteService';
import { Quote } from '@/types/quote';
import { QuoteDetailsType } from '@/types/quoteForm';

interface CreateQuoteProps {
  driverId: string;
  clientId: string;
  selectedVehicle: string;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number];
  destinationCoordinates: [number, number];
  dateTime: Date;
  estimatedDistance: number;
  estimatedDuration: number;
  quoteDetails: QuoteDetailsType;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  returnDistance: number;
  returnDuration: number;
  customReturnCoordinates: [number, number];
}

/**
 * Hook pour la création de devis
 * Gère la création de nouveaux devis avec toutes les propriétés requises
 */
export const useQuoteCreator = () => {
  const { toast } = useToast();

  /**
   * Crée un nouveau devis dans la base de données
   * @param props - Les propriétés nécessaires pour créer le devis
   * @returns Un objet Quote complet
   */
  const createQuote = async (props: CreateQuoteProps): Promise<Quote> => {
    const {
      driverId,
      clientId,
      selectedVehicle,
      departureAddress,
      destinationAddress,
      departureCoordinates,
      destinationCoordinates,
      dateTime,
      estimatedDistance,
      estimatedDuration,
      quoteDetails,
      hasReturnTrip,
      hasWaitingTime,
      waitingTimeMinutes,
      waitingTimePrice,
      returnToSameAddress,
      customReturnAddress,
      customReturnCoordinates,
      returnDistance,
      returnDuration
    } = props;

    if (!quoteDetails) {
      console.error("Erreur critique: détails du devis manquants");
      throw new Error("Erreur lors du calcul du devis");
    }

    try {
      console.log("Préparation des données du devis pour l'enregistrement:", {
        driverId, clientId, selectedVehicle, departureAddress, destinationAddress
      });
      
      // Construction de l'objet quoteData avec toutes les propriétés obligatoires du type Quote
      const quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf" | "vehicles" | "clients"> = {
        driver_id: driverId,
        client_id: clientId,
        vehicle_id: selectedVehicle,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration,
        ride_date: dateTime.toISOString(),
        amount: quoteDetails.totalPrice || 0,
        status: "pending",
        
        // Propriétés liées au trajet
        has_return_trip: hasReturnTrip,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: waitingTimeMinutes || 0,
        waiting_time_price: waitingTimePrice || 0,
        return_to_same_address: returnToSameAddress,
        custom_return_address: customReturnAddress || '',
        return_coordinates: customReturnCoordinates,
        return_distance_km: returnDistance || 0,
        return_duration_minutes: returnDuration || 0,
        
        // Propriétés liées au calcul de prix
        day_km: quoteDetails.dayKm || 0,
        night_km: quoteDetails.nightKm || 0,
        total_km: quoteDetails.totalKm || 0,
        day_price: quoteDetails.dayPrice || 0,
        night_price: quoteDetails.nightPrice || 0,
        night_surcharge: quoteDetails.nightSurcharge || 0,
        has_night_rate: quoteDetails.isNightRate || false,
        night_hours: quoteDetails.nightHours || 0,
        night_rate_percentage: quoteDetails.nightRatePercentage || 0,
        is_sunday_holiday: quoteDetails.isSunday || false,
        sunday_holiday_percentage: quoteDetails.sundayRate || 0,
        sunday_holiday_surcharge: quoteDetails.sundaySurcharge || 0,
        wait_time_day: quoteDetails.waitTimeDay || 0,
        wait_time_night: quoteDetails.waitTimeNight || 0,
        wait_price_day: quoteDetails.waitPriceDay || 0,
        wait_price_night: quoteDetails.waitPriceNight || 0,
        
        // Propriétés liées aux montants
        amount_ht: quoteDetails.totalPriceHT || 0, 
        total_ht: quoteDetails.totalPriceHT || 0,
        vat: quoteDetails.totalVAT || 0,
        total_ttc: quoteDetails.totalPrice || 0,
        one_way_price_ht: quoteDetails.oneWayPriceHT || 0,
        one_way_price: quoteDetails.oneWayPrice || 0,
        return_price_ht: quoteDetails.returnPriceHT || 0,
        return_price: quoteDetails.returnPrice || 0,
        day_hours: quoteDetails.dayHours || 0
      };

      console.log("Données du devis préparées:", quoteData);
      
      const savedQuote = await quoteService.createQuote({
        driverId,
        clientId,
        quoteData
      });

      console.log("📝 Devis enregistré avec succès:", savedQuote);

      return savedQuote;
      
    } catch (error) {
      console.error('📝 ❌ Erreur détaillée lors de l\'enregistrement du devis:', error);
      
      // Log détaillé pour faciliter le débogage
      if (error instanceof Error) {
        console.error(`Type d'erreur: ${error.constructor.name}`);
        console.error(`Message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
      } else {
        console.error(`Erreur non standard: ${JSON.stringify(error)}`);
      }
      
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return { createQuote };
};
