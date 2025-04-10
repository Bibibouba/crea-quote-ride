
import { useState, useEffect } from 'react';
import { usePricing } from '@/hooks/use-pricing';
import { useVehicles } from '@/hooks/useVehicles';

export function useQuotePricing(
  selectedVehicle: string,
  estimatedDistance: number,
  estimatedDuration: number, // Added missing parameter
  time: string,
  hasReturnTrip: boolean,
  returnToSameAddress: boolean,
  returnDistance: number,
  returnDuration: number, // Added missing parameter
  hasWaitingTime: boolean,
  waitingTimeMinutes: number
) {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { pricingSettings, loading: pricingLoading, distanceTiers } = usePricing();
  
  const [price, setPrice] = useState(0);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  
  // Calculate waiting time price
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
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
      const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
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
  
  // Calculate total price
  useEffect(() => {
    if (!selectedVehicle || !pricingSettings || !distanceTiers) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    const vehicleTypeId = vehicle.vehicle_type_id;
    
    let pricePerKm = pricingSettings.price_per_km;
    
    if (distanceTiers && distanceTiers.length > 0) {
      const applicableTiers = distanceTiers.filter(tier => 
        !tier.vehicle_id || tier.vehicle_id === vehicleTypeId
      );
      
      const applicableTier = applicableTiers.find(tier => 
        estimatedDistance >= tier.min_km && 
        (!tier.max_km || estimatedDistance <= tier.max_km)
      );
      
      if (applicableTier) {
        pricePerKm = applicableTier.price_per_km;
      }
    }
    
    let oneWayPrice = pricingSettings.base_fare + (estimatedDistance * pricePerKm);
    
    if (pricingSettings.night_rate_enabled && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.night_rate_start?.split(':').map(Number) || [0, 0];
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      if (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      ) {
        const nightPercentage = pricingSettings.night_rate_percentage || 0;
        oneWayPrice += oneWayPrice * (nightPercentage / 100);
      }
    }
    
    if (oneWayPrice < pricingSettings.min_fare) {
      oneWayPrice = pricingSettings.min_fare;
    }
    
    let returnPrice = 0;
    if (hasReturnTrip) {
      if (returnToSameAddress) {
        returnPrice = oneWayPrice;
      } else if (returnDistance > 0) {
        returnPrice = pricingSettings.base_fare + (returnDistance * pricePerKm);
        
        if (returnPrice < pricingSettings.min_fare) {
          returnPrice = pricingSettings.min_fare;
        }
      }
    }
    
    const totalPrice = oneWayPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
    
    setPrice(Math.round(totalPrice));
    
    setQuoteDetails({
      vehicleName: vehicle.name,
      vehicleModel: vehicle.model,
      distance: estimatedDistance,
      duration: estimatedDuration,
      returnDistance,
      returnDuration,
      baseFare: pricingSettings.base_fare,
      pricePerKm,
      oneWayPrice: Math.round(oneWayPrice),
      waitingTimePrice: hasWaitingTime ? waitingTimePrice : 0,
      returnPrice: Math.round(returnPrice),
      totalPrice: Math.round(totalPrice),
      hasReturnTrip,
      hasWaitingTime,
      waitingTimeMinutes,
      returnToSameAddress
    });
  }, [
    selectedVehicle, time, 
    estimatedDistance, estimatedDuration, vehicles, pricingSettings, distanceTiers,
    hasReturnTrip, hasWaitingTime, waitingTimePrice, waitingTimeMinutes,
    returnToSameAddress, returnDistance, returnDuration
  ]);
  
  return {
    price,
    waitingTimePrice,
    quoteDetails,
    vehiclesLoading,
    pricingLoading,
    vehicles
  };
}
