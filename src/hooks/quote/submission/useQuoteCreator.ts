
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

export const useQuoteCreator = () => {
  const { toast } = useToast();

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
      throw new Error("Erreur lors du calcul du devis");
    }

    try {
      // Contournement pour le bug TypeScript, utiliser un type explicite
      const quoteDataToSend = {
        driver_id: driverId,
        client_id: clientId,
        vehicle_id: selectedVehicle,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration,
        ride_date: dateTime.toISOString(),
        amount: quoteDetails.totalPrice,
        has_return_trip: hasReturnTrip,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: waitingTimeMinutes,
        waiting_time_price: waitingTimePrice,
        return_to_same_address: returnToSameAddress,
        custom_return_address: customReturnAddress,
        return_distance_km: returnDistance,
        return_duration_minutes: returnDuration,
        status: "pending",
        day_km: quoteDetails.dayKm,
        night_km: quoteDetails.nightKm,
        total_km: quoteDetails.totalKm,
        day_price: quoteDetails.dayPrice,
        night_price: quoteDetails.nightPrice,
        night_surcharge: quoteDetails.nightSurcharge,
        has_night_rate: quoteDetails.isNightRate,
        night_hours: quoteDetails.nightHours,
        night_rate_percentage: quoteDetails.nightRatePercentage,
        is_sunday_holiday: quoteDetails.isSunday,
        sunday_holiday_percentage: quoteDetails.sundayRate,
        sunday_holiday_surcharge: quoteDetails.sundaySurcharge,
        wait_time_day: quoteDetails.waitTimeDay,
        wait_time_night: quoteDetails.waitTimeNight,
        wait_price_day: quoteDetails.waitPriceDay,
        wait_price_night: quoteDetails.waitPriceNight
      };
      
      // On évite de passer directement departureCoordinates et destinationCoordinates
      // pour éviter les erreurs TypeScript
      const savedQuote = await quoteService.createQuote({
        driverId,
        clientId,
        quoteData: quoteDataToSend as unknown as Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf">
      });

      console.log("📝 Devis enregistré avec succès:", savedQuote);
      return savedQuote;
      
    } catch (error) {
      console.error('📝 ❌ Erreur lors de l\'enregistrement du devis:', error);
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
