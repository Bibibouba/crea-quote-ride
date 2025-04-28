
import { useState, useEffect } from 'react';
import { useQuoteForm } from '@/hooks/useQuoteForm';
import { useClientSimulator } from '@/hooks/useClientSimulator';
import { postToParent } from '@/utils/postMessage';

interface SimulatorProps {
  isWidget?: boolean;
  prefill?: {
    departure?: string;
    destination?: string;
    date?: string;
    time?: string;
    passengers?: string;
    vehicleType?: string;
  };
}

export const useSimulator = ({ isWidget = false, prefill }: SimulatorProps = {}) => {
  const {
    isSubmitting,
    isQuoteSent,
    submitQuote,
    resetForm,
    navigateToDashboard
  } = useClientSimulator();

  const [simulatorReady, setSimulatorReady] = useState(true);
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3'>('step1');
  const formState = useQuoteForm();

  useEffect(() => {
    if (isWidget && prefill) {
      if (prefill.departure) formState.setDepartureAddress(prefill.departure);
      if (prefill.destination) formState.setDestinationAddress(prefill.destination);
      if (prefill.vehicleType) formState.setSelectedVehicle(prefill.vehicleType);
      if (prefill.passengers) formState.setPassengers(prefill.passengers);
    }
  }, [isWidget, prefill]);

  useEffect(() => {
    setSimulatorReady(false);
    const timeout = setTimeout(() => {
      setSimulatorReady(true);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (formState.quoteDetails) {
      console.log("Calcul jour/nuit:", {
        dayKm: formState.quoteDetails.dayKm,
        nightKm: formState.quoteDetails.nightKm,
        totalKm: formState.quoteDetails.totalKm,
        dayPercentage: formState.quoteDetails.dayPercentage,
        nightPercentage: formState.quoteDetails.nightPercentage,
        isNightRate: formState.quoteDetails.isNightRate,
        nightHours: formState.quoteDetails.nightHours,
        dayHours: formState.quoteDetails.dayHours,
        nightRatePercentage: formState.quoteDetails.nightRatePercentage,
        nightStartDisplay: formState.quoteDetails.nightStartDisplay,
        nightEndDisplay: formState.quoteDetails.nightEndDisplay,
        time: formState.time,
        estimatedDuration: formState.estimatedDuration
      });
    }
  }, [formState.quoteDetails, formState.time, formState.estimatedDuration]);

  const handleNextStep = () => {
    const newTab = activeTab === 'step1' ? 'step2' : 'step3';
    setActiveTab(newTab);
    if (isWidget) {
      postToParent('STEP_CHANGED', { 
        step: newTab === 'step2' ? 2 : 3, 
        name: newTab 
      });
    }
  };

  const handlePreviousStep = () => {
    const newTab = activeTab === 'step3' ? 'step2' : 'step1';
    setActiveTab(newTab);
    if (isWidget) {
      postToParent('STEP_CHANGED', { 
        step: newTab === 'step1' ? 1 : 2, 
        name: newTab 
      });
    }
  };

  const handleSubmit = async () => {
    if (!formState.quoteDetails) {
      if (isWidget) {
        postToParent('QUOTE_ERROR', { 
          message: "Quote details not available" 
        });
      }
      return Promise.reject(new Error("Quote details not available"));
    }

    try {
      const rideDate = formState.date instanceof Date && !isNaN(formState.date.getTime())
        ? formState.date.toISOString()
        : new Date().toISOString();

      const quoteData = {
        vehicle_id: formState.selectedVehicle,
        departure_location: formState.departureAddress,
        arrival_location: formState.destinationAddress,
        departure_coordinates: formState.departureCoordinates,
        arrival_coordinates: formState.destinationCoordinates,
        distance_km: formState.estimatedDistance,
        duration_minutes: formState.estimatedDuration,
        ride_date: rideDate,
        amount: formState.quoteDetails.totalPrice,
        has_return_trip: formState.hasReturnTrip,
        has_waiting_time: formState.hasWaitingTime,
        waiting_time_minutes: formState.waitingTimeMinutes,
        waiting_time_price: formState.quoteDetails.waitingTimePrice,
        return_to_same_address: formState.returnToSameAddress,
        custom_return_address: formState.customReturnAddress,
        return_coordinates: formState.customReturnCoordinates,
        return_distance_km: formState.returnDistance,
        return_duration_minutes: formState.returnDuration,
        has_night_rate: formState.quoteDetails.isNightRate || false,
        night_hours: formState.quoteDetails.nightHours || 0,
        night_rate_percentage: formState.quoteDetails.nightRatePercentage || 0,
        night_surcharge: formState.quoteDetails.nightSurcharge || 0,
        is_sunday_holiday: formState.quoteDetails.isSunday || false,
        sunday_holiday_percentage: formState.quoteDetails.sundayRate || 0,
        sunday_holiday_surcharge: formState.quoteDetails.sundaySurcharge || 0,
        day_km: formState.quoteDetails.dayKm || 0,
        night_km: formState.quoteDetails.nightKm || 0,
        day_price: formState.quoteDetails.dayPrice || 0,
        night_price: formState.quoteDetails.nightPrice || 0,
        wait_time_day: formState.quoteDetails.waitTimeDay || 0,
        wait_time_night: formState.quoteDetails.waitTimeNight || 0,
        wait_price_day: formState.quoteDetails.waitPriceDay || 0,
        wait_price_night: formState.quoteDetails.waitPriceNight || 0,
        amount_ht: formState.quoteDetails.totalPriceHT || 0,
        total_ttc: formState.quoteDetails.totalPrice || 0
      };

      const clientData = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        phone: formState.phone
      };

      const result = await submitQuote(quoteData, clientData);

      if (isWidget && result) {
        postToParent('QUOTE_READY', {
          quoteId: result.id,
          amount: result.amount,
          totalTTC: result.total_ttc
        });
      }

      return result;
    } catch (error: any) {
      if (isWidget) {
        postToParent('QUOTE_ERROR', { 
          message: error.message 
        });
      }
      throw error;
    }
  };

  return {
    simulatorReady,
    isSubmitting,
    isQuoteSent,
    activeTab,
    setActiveTab,
    formState,
    handleNextStep,
    handlePreviousStep,
    handleSubmit,
    resetForm,
    navigateToDashboard
  };
};
