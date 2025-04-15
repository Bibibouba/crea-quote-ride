
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateDetailedWaitingPrice } from '@/utils/pricing';
import { Vehicle, QuoteDetails } from '@/types/quoteForm';

interface UseSaveQuoteProps {
  quoteDetails: QuoteDetails | null;
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date: Date;
  time: string;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  customReturnCoordinates?: [number, number];
  returnDistance: number;
  returnDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  estimatedDistance: number;
  estimatedDuration: number;
  selectedVehicle: string;
  vehicles: Vehicle[];
  pricingSettings: any;
}

export const useSaveQuote = ({
  quoteDetails,
  departureAddress,
  destinationAddress,
  departureCoordinates,
  destinationCoordinates,
  date,
  time,
  hasReturnTrip,
  returnToSameAddress,
  customReturnAddress,
  customReturnCoordinates,
  returnDistance,
  returnDuration,
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  estimatedDistance,
  estimatedDuration,
  selectedVehicle,
  vehicles,
  pricingSettings
}: UseSaveQuoteProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  
  const handleSaveQuote = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const driverId = session?.user?.id;
      
      if (!driverId) {
        console.log('No authenticated driver found');
        setIsSubmitting(false);
        return;
      }
      
      let waitTimeDay = 0;
      let waitTimeNight = 0;
      let waitPriceDay = 0;
      let waitPriceNight = 0;
      
      if (hasWaitingTime && waitingTimeMinutes > 0) {
        const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
        const waitingTimeDetails = calculateDetailedWaitingPrice(
          hasWaitingTime,
          waitingTimeMinutes,
          pricingSettings,
          time,
          date,
          selectedVehicleInfo,
          selectedVehicleInfo?.wait_night_enabled || false
        );
        
        waitTimeDay = waitingTimeDetails.waitTimeDay;
        waitTimeNight = waitingTimeDetails.waitTimeNight;
        waitPriceDay = waitingTimeDetails.waitPriceDay;
        waitPriceNight = waitingTimeDetails.waitPriceNight;
      }
      
      const quoteData = {
        driver_id: driverId,
        client_id: "", // This needs to be set depending on your app flow
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        ride_date: date.toISOString(),
        amount: quoteDetails?.totalPrice || 0,
        status: "pending",
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration,
        has_return_trip: hasReturnTrip,
        return_to_same_address: returnToSameAddress,
        return_distance_km: returnDistance,
        return_duration_minutes: returnDuration,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: waitingTimeMinutes,
        waiting_time_price: waitingTimePrice,
        day_km: quoteDetails?.dayKm,
        night_km: quoteDetails?.nightKm,
        total_km: quoteDetails?.totalKm,
        day_price: quoteDetails?.dayPrice,
        night_price: quoteDetails?.nightPrice,
        has_night_rate: quoteDetails?.isNightRate,
        night_hours: quoteDetails?.nightHours,
        night_rate_percentage: quoteDetails?.nightRatePercentage,
        night_surcharge: quoteDetails?.nightSurcharge,
        is_sunday_holiday: quoteDetails?.isSunday,
        sunday_holiday_percentage: quoteDetails?.sundayRate,
        sunday_holiday_surcharge: quoteDetails?.sundaySurcharge,
        wait_time_day: waitTimeDay,
        wait_time_night: waitTimeNight,
        wait_price_day: waitPriceDay,
        wait_price_night: waitPriceNight
      };
      
      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select();
      
      if (error) {
        console.error('Error saving quote:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder la demande',
          variant: 'destructive',
        });
      } else {
        setIsQuoteSent(true);
        toast({
          title: 'Demande sauvegardée',
          description: 'Votre demande a été enregistrée avec succès',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la demande',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    handleSaveQuote
  };
};
