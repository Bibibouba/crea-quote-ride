
import { useEffect, useState } from 'react';
import { useMapbox, Address } from './useMapbox';
import { usePricing } from './use-pricing';
import { useVehicleTypes } from './useVehicleTypes';
import { supabase } from '@/integrations/supabase/client';

export interface WaitingTimeOption {
  value: number;
  label: string;
}

// Define the Vehicle interface
interface Vehicle {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  description: string;
}

export const useQuoteForm = () => {
  const { getRoute } = useMapbox();
  const { pricingSettings } = usePricing();
  const { vehicleTypes, loading: isLoadingVehicleTypes } = useVehicleTypes();

  // State for addresses
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);

  // State for trip details
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');

  // State for route
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  // Return options
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);

  // UI flow
  const [currentStep, setCurrentStep] = useState(1);
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);

  // Client information
  const [selectedClient, setSelectedClient] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Vehicle data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  // Quote details and price calculation
  const [quoteDetails, setQuoteDetails] = useState<any>(null);

  // Waiting time options
  const waitingTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const minutes = (i + 1) * 15;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let label = "";
    if (hours > 0) {
      label += `${hours} heure${hours > 1 ? 's' : ''}`;
      if (remainingMinutes > 0) {
        label += ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else {
      label = `${minutes} minutes`;
    }
    
    return {
      value: minutes,
      label
    };
  });

  // Load vehicles from vehicle types
  useEffect(() => {
    if (vehicleTypes.length > 0) {
      const fetchVehicles = async () => {
        setIsLoadingVehicles(true);
        
        try {
          const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('is_active', true);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Map the data to the Vehicle interface
            const mappedVehicles = data.map(vehicle => ({
              id: vehicle.id,
              name: vehicle.name,
              basePrice: getPriceForVehicle(vehicle.id),
              capacity: vehicle.capacity,
              description: vehicle.model
            }));
            
            setVehicles(mappedVehicles);
            
            // If there's at least one vehicle, select it by default
            if (mappedVehicles.length > 0 && !selectedVehicle) {
              setSelectedVehicle(mappedVehicles[0].id);
            }
          } else {
            // If no vehicles found, create default vehicles from vehicle types
            const defaultVehicles = vehicleTypes.map((type, index) => ({
              id: type.id,
              name: type.name,
              basePrice: 1.8 + (index * 0.4), // Basic pricing scheme
              capacity: 4 + (index * 2), // Basic capacity scheme
              description: `Véhicule ${type.name}`
            }));
            
            setVehicles(defaultVehicles);
            
            if (defaultVehicles.length > 0 && !selectedVehicle) {
              setSelectedVehicle(defaultVehicles[0].id);
            }
          }
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        } finally {
          setIsLoadingVehicles(false);
        }
      };
      
      fetchVehicles();
    }
  }, [vehicleTypes, selectedVehicle]);

  // Function to get price for a vehicle based on pricing settings
  const getPriceForVehicle = (vehicleId: string): number => {
    if (pricingSettings) {
      // Use system-wide pricing if available
      return pricingSettings.price_per_km || 1.8;
    }
    
    // Default values based on vehicle type
    const vehicleIndex = vehicleTypes.findIndex(v => v.id === vehicleId);
    if (vehicleIndex >= 0) {
      return 1.8 + (vehicleIndex * 0.4); // Basic pricing scheme
    }
    
    return 1.8; // Default price
  };

  // Calculate waiting time price
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
    const pricePerMin = pricingSettings.waiting_fee_per_minute || 0.5;
    const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
    
    const quarters = Math.ceil(waitingTimeMinutes / 15);
    let price = quarters * pricePerQuarter;
    
    if (pricingSettings.wait_night_enabled && pricingSettings.wait_night_percentage && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.wait_night_start?.split(':').map(Number) || [0, 0];
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricingSettings.wait_night_end?.split(':').map(Number) || [0, 0];
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      const isNight = (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      );
      
      if (isNight) {
        const nightPercentage = pricingSettings.wait_night_percentage || 0;
        price += price * (nightPercentage / 100);
      }
    }
    
    setWaitingTimePrice(Math.round(price));
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time]);

  // Calculate return route when needed
  useEffect(() => {
    const calculateReturnRoute = async () => {
      if (!hasReturnTrip || returnToSameAddress || !customReturnCoordinates || !destinationCoordinates) {
        return;
      }
      
      try {
        const route = await getRoute(destinationCoordinates, customReturnCoordinates);
        if (route) {
          setReturnDistance(Math.round(route.distance));
          setReturnDuration(Math.round(route.duration));
        }
      } catch (error) {
        console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
      }
    };
    
    calculateReturnRoute();
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, getRoute]);

  // Calculate quote details when relevant parameters change
  useEffect(() => {
    // Only calculate if we have the necessary data
    if (!selectedVehicle || estimatedDistance === 0) return;
    
    const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
    if (!selectedVehicleInfo) return;
    
    const basePrice = selectedVehicleInfo.basePrice;
    
    // Check if time is during night hours for night rate
    let isNightRate = false;
    let isSunday = false;
    
    if (date && time && pricingSettings) {
      // Check for night rate
      if (pricingSettings.night_rate_enabled && pricingSettings.night_rate_start && pricingSettings.night_rate_end) {
        const [hours, minutes] = time.split(':').map(Number);
        const tripTime = new Date(date);
        tripTime.setHours(hours);
        tripTime.setMinutes(minutes);
        
        const startTime = new Date(date);
        const [startHours, startMinutes] = pricingSettings.night_rate_start.split(':').map(Number);
        startTime.setHours(startHours);
        startTime.setMinutes(startMinutes);
        
        const endTime = new Date(date);
        const [endHours, endMinutes] = pricingSettings.night_rate_end.split(':').map(Number);
        endTime.setHours(endHours);
        endTime.setMinutes(endMinutes);
        
        isNightRate = (
          (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
          (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
        );
      }
      
      // Check if it's Sunday
      const dayOfWeek = date.getDay();
      isSunday = dayOfWeek === 0;
    }
    
    // Calculate basic prices
    let oneWayPriceHT = estimatedDistance * basePrice;
    let returnPriceHT = hasReturnTrip ? (returnToSameAddress ? estimatedDistance * basePrice : returnDistance * basePrice) : 0;
    
    // Apply night rate if applicable
    if (isNightRate && pricingSettings && pricingSettings.night_rate_percentage) {
      const nightPercentage = pricingSettings.night_rate_percentage / 100;
      oneWayPriceHT += oneWayPriceHT * nightPercentage;
      returnPriceHT += returnPriceHT * nightPercentage;
    }
    
    // Apply Sunday/holiday rate if applicable
    if (isSunday && pricingSettings && pricingSettings.holiday_sunday_percentage) {
      const sundayPercentage = pricingSettings.holiday_sunday_percentage / 100;
      oneWayPriceHT += oneWayPriceHT * sundayPercentage;
      returnPriceHT += returnPriceHT * sundayPercentage;
    }
    
    // Round prices
    oneWayPriceHT = Math.round(oneWayPriceHT);
    returnPriceHT = Math.round(returnPriceHT);
    
    // Apply waiting time price
    const waitingTimePriceHT = hasWaitingTime ? waitingTimePrice : 0;
    
    // Apply VAT rates with safe defaults
    const rideVatRate = pricingSettings?.ride_vat_rate !== undefined ? pricingSettings.ride_vat_rate : 10; // 10% for rides
    const waitingVatRate = pricingSettings?.waiting_vat_rate !== undefined ? pricingSettings.waiting_vat_rate : 20; // 20% for waiting time
    
    // Calculate TTC prices
    const oneWayPrice = oneWayPriceHT * (1 + (rideVatRate / 100));
    const returnPrice = returnPriceHT * (1 + (rideVatRate / 100));
    const waitingTimePriceTTC = waitingTimePriceHT * (1 + (waitingVatRate / 100));
    
    // Calculate totals
    const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
    
    // Calculate VAT amounts
    const rideVAT = (oneWayPriceHT + returnPriceHT) * (rideVatRate / 100);
    const waitingVAT = waitingTimePriceHT * (waitingVatRate / 100);
    const totalVAT = rideVAT + waitingVAT;
    
    // Calculate total TTC
    const totalPrice = totalPriceHT + totalVAT;
    
    // Update quote details
    setQuoteDetails({
      basePrice,
      isNightRate,
      isSunday,
      oneWayPriceHT: Math.round(oneWayPriceHT),
      oneWayPrice: Math.round(oneWayPrice),
      returnPriceHT: Math.round(returnPriceHT),
      returnPrice: Math.round(returnPrice),
      waitingTimePriceHT: Math.round(waitingTimePriceHT),
      waitingTimePrice: Math.round(waitingTimePriceTTC),
      totalPriceHT: Math.round(totalPriceHT),
      totalVAT: Math.round(totalVAT),
      totalPrice: Math.round(totalPrice),
      rideVatRate,
      waitingVatRate
    });
  }, [
    selectedVehicle, 
    estimatedDistance, 
    returnDistance, 
    hasReturnTrip, 
    returnToSameAddress, 
    vehicles,
    hasWaitingTime,
    waitingTimePrice,
    time,
    date,
    pricingSettings
  ]);

  // Helper functions for addresses
  const handleDepartureSelect = (address: Address) => {
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  };

  const handleDestinationSelect = (address: Address) => {
    setDestinationAddress(address.fullAddress);
    setDestinationCoordinates(address.coordinates);
  };

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  };

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };

  // Navigation between steps
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetForm = () => {
    setCurrentStep(1);
    setShowQuote(false);
    setIsQuoteSent(false);
  };

  return {
    // Address state
    departureAddress,
    setDepartureAddress,
    destinationAddress,
    setDestinationAddress,
    departureCoordinates,
    setDepartureCoordinates,
    destinationCoordinates,
    setDestinationCoordinates,
    
    // Trip details state
    date,
    setDate,
    time,
    setTime,
    selectedVehicle,
    setSelectedVehicle,
    passengers,
    setPassengers,
    
    // Route state
    estimatedDistance,
    setEstimatedDistance,
    estimatedDuration,
    setEstimatedDuration,
    
    // Return options state
    hasReturnTrip,
    setHasReturnTrip,
    hasWaitingTime,
    setHasWaitingTime,
    waitingTimeMinutes,
    setWaitingTimeMinutes,
    waitingTimePrice,
    setWaitingTimePrice,
    returnToSameAddress,
    setReturnToSameAddress,
    customReturnAddress,
    setCustomReturnAddress,
    customReturnCoordinates,
    setCustomReturnCoordinates,
    returnDistance,
    setReturnDistance,
    returnDuration,
    setReturnDuration,
    
    // UI flow state
    currentStep,
    setCurrentStep,
    showQuote,
    setShowQuote,
    isLoading,
    setIsLoading,
    isSubmitting,
    setIsSubmitting,
    isQuoteSent,
    setIsQuoteSent,
    
    // Client information state
    selectedClient,
    setSelectedClient,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    
    // Vehicles and options
    vehicles,
    isLoadingVehicles,
    waitingTimeOptions,
    
    // Quote details
    quoteDetails,
    
    // Helper functions
    handleDepartureSelect,
    handleDestinationSelect,
    handleReturnAddressSelect,
    handleRouteCalculated,
    nextStep,
    prevStep,
    resetForm
  };
};
