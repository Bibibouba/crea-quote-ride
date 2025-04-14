import { PricingSettings, QuoteDetails } from '@/types/quoteForm';

export const calculateWaitingTimePrice = (
  hasWaitingTime: boolean, 
  waitingTimeMinutes: number, 
  pricingSettings: PricingSettings | null,
  time: string,
  selectedVehicle: any = null
): number => {
  if (!hasWaitingTime) return 0;
  
  // Priorité aux paramètres du véhicule si disponibles
  const pricePerQuarter = selectedVehicle?.wait_price_per_15min || 
                        pricingSettings?.wait_price_per_15min || 7.5;
  
  const quarters = Math.ceil(waitingTimeMinutes / 15);
  let price = quarters * pricePerQuarter;
  
  // Vérifier si le tarif de nuit est activé pour ce véhicule
  const useVehicleWaitNight = selectedVehicle?.wait_night_enabled && 
                             selectedVehicle?.wait_night_start && 
                             selectedVehicle?.wait_night_end && 
                             selectedVehicle?.wait_night_percentage;
  
  // Vérifier si c'est un tarif de nuit (en priorité celui du véhicule)
  if ((useVehicleWaitNight || (pricingSettings?.wait_night_enabled && pricingSettings?.wait_night_percentage)) && time) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date();
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    // Priorité aux paramètres du véhicule
    const startTime = new Date();
    const startTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_start : pricingSettings?.wait_night_start;
    const [startHours, startMinutes] = startTimeStr?.split(':').map(Number) || [0, 0];
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date();
    const endTimeStr = useVehicleWaitNight ? selectedVehicle.wait_night_end : pricingSettings?.wait_night_end;
    const [endHours, endMinutes] = endTimeStr?.split(':').map(Number) || [0, 0];
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    const isNight = (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
    
    if (isNight) {
      const nightPercentage = useVehicleWaitNight ? 
                            selectedVehicle.wait_night_percentage : 
                            pricingSettings?.wait_night_percentage || 0;
      price += price * (nightPercentage / 100);
    }
  }
  
  return Math.round(price);
};

export const isNightTime = (date: Date, time: string, vehicleSettings: any, settings: PricingSettings | null): boolean => {
  // Vérifier d'abord si le véhicule a ses propres paramètres de tarif de nuit
  if (vehicleSettings && vehicleSettings.night_rate_enabled && 
      vehicleSettings.night_rate_start && vehicleSettings.night_rate_end) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date(date);
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date(date);
    const [startHours, startMinutes] = vehicleSettings.night_rate_start.split(':').map(Number);
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date(date);
    const [endHours, endMinutes] = vehicleSettings.night_rate_end.split(':').map(Number);
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    return (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
  }
  
  // Sinon, utiliser les paramètres globaux
  if (!settings || !settings.night_rate_enabled || !settings.night_rate_start || !settings.night_rate_end) {
    return false;
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  const tripTime = new Date(date);
  tripTime.setHours(hours);
  tripTime.setMinutes(minutes);
  
  const startTime = new Date(date);
  const [startHours, startMinutes] = settings.night_rate_start.split(':').map(Number);
  startTime.setHours(startHours);
  startTime.setMinutes(startMinutes);
  
  const endTime = new Date(date);
  const [endHours, endMinutes] = settings.night_rate_end.split(':').map(Number);
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);
  
  return (
    (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
    (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
  );
};

export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

// Fonction pour calculer la durée de trajet qui est en tarif de nuit
export const calculateNightDuration = (
  startDate: Date,
  startTime: string,
  durationMinutes: number,
  vehicleSettings: any,
  globalSettings: PricingSettings | null
): { nightMinutes: number, totalMinutes: number } => {
  if ((!vehicleSettings?.night_rate_enabled && !globalSettings?.night_rate_enabled) || durationMinutes <= 0) {
    return { nightMinutes: 0, totalMinutes: durationMinutes };
  }
  
  // Utiliser les paramètres du véhicule ou les paramètres globaux
  const nightStart = vehicleSettings?.night_rate_enabled ? 
    vehicleSettings.night_rate_start : 
    globalSettings?.night_rate_start;
  
  const nightEnd = vehicleSettings?.night_rate_enabled ? 
    vehicleSettings.night_rate_end : 
    globalSettings?.night_rate_end;
  
  if (!nightStart || !nightEnd) {
    return { nightMinutes: 0, totalMinutes: durationMinutes };
  }
  
  // Convertir le temps de départ en minutes depuis minuit
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const departureMinutes = startHours * 60 + startMinutes;
  
  // Convertir les heures de tarif de nuit en minutes depuis minuit
  const [nightStartHours, nightStartMins] = nightStart.split(':').map(Number);
  const nightStartMinutes = nightStartHours * 60 + nightStartMins;
  
  const [nightEndHours, nightEndMins] = nightEnd.split(':').map(Number);
  const nightEndMinutes = nightEndHours * 60 + nightEndMins;
  
  // Calculer l'heure d'arrivée en minutes depuis minuit
  const arrivalMinutes = (departureMinutes + durationMinutes) % 1440; // 1440 = minutes in a day
  
  // Si la période de nuit franchit minuit (ex: 22h-6h)
  if (nightStartMinutes > nightEndMinutes) {
    // Cas 1: Le départ est après l'heure de début de nuit
    if (departureMinutes >= nightStartMinutes) {
      // Si l'arrivée est avant l'heure de fin de nuit le jour suivant
      if (arrivalMinutes <= nightEndMinutes) {
        return { nightMinutes: durationMinutes, totalMinutes: durationMinutes };
      }
      // Si l'arrivée est après l'heure de fin de nuit le jour suivant
      else {
        // Calculer la partie de nuit jusqu'à la fin de nuit
        const nightPortionMinutes = (1440 - departureMinutes) + nightEndMinutes;
        return { 
          nightMinutes: Math.min(nightPortionMinutes, durationMinutes), 
          totalMinutes: durationMinutes 
        };
      }
    }
    // Cas 2: Le départ est avant l'heure de fin de nuit
    else if (departureMinutes < nightEndMinutes) {
      // Si l'arrivée est avant l'heure de fin de nuit
      if (arrivalMinutes <= nightEndMinutes) {
        return { nightMinutes: durationMinutes, totalMinutes: durationMinutes };
      }
      // Si l'arrivée est après l'heure de fin de nuit
      else {
        return { 
          nightMinutes: nightEndMinutes - departureMinutes, 
          totalMinutes: durationMinutes 
        };
      }
    }
    // Cas 3: Le départ est entre la fin de nuit et le début de nuit
    else {
      // Si l'arrivée est avant le début de nuit
      if (arrivalMinutes < nightStartMinutes) {
        return { nightMinutes: 0, totalMinutes: durationMinutes };
      }
      // Si l'arrivée est après le début de nuit
      else {
        return { 
          nightMinutes: arrivalMinutes - nightStartMinutes, 
          totalMinutes: durationMinutes 
        };
      }
    }
  }
  // Si la période de nuit ne franchit pas minuit (ex: 0h-6h ou 22h-23h59)
  else {
    // Calculer le chevauchement entre la course et la période de nuit
    const courseStart = departureMinutes;
    const courseEnd = departureMinutes + durationMinutes;
    
    // Aucun chevauchement si la course se termine avant le début de la nuit ou commence après la fin
    if (courseEnd <= nightStartMinutes || courseStart >= nightEndMinutes) {
      return { nightMinutes: 0, totalMinutes: durationMinutes };
    }
    
    // Si la course est entièrement dans la période de nuit
    if (courseStart >= nightStartMinutes && courseEnd <= nightEndMinutes) {
      return { nightMinutes: durationMinutes, totalMinutes: durationMinutes };
    }
    
    // Si la course commence avant le début de la nuit mais se termine pendant
    if (courseStart < nightStartMinutes && courseEnd <= nightEndMinutes) {
      return { 
        nightMinutes: courseEnd - nightStartMinutes, 
        totalMinutes: durationMinutes 
      };
    }
    
    // Si la course commence pendant la nuit mais se termine après
    if (courseStart >= nightStartMinutes && courseEnd > nightEndMinutes) {
      return { 
        nightMinutes: nightEndMinutes - courseStart, 
        totalMinutes: durationMinutes 
      };
    }
    
    // Si la course englobe totalement la période de nuit
    return { 
      nightMinutes: nightEndMinutes - nightStartMinutes, 
      totalMinutes: durationMinutes 
    };
  }
};

export const calculateQuoteDetails = (
  selectedVehicle: string,
  estimatedDistance: number,
  returnDistance: number,
  hasReturnTrip: boolean,
  returnToSameAddress: boolean,
  vehicles: any[],
  hasWaitingTime: boolean,
  waitingTimePrice: number,
  time: string,
  date: Date,
  pricingSettings: PricingSettings | null
): QuoteDetails | null => {
  if (!selectedVehicle || estimatedDistance === 0) return null;
  
  const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
  if (!selectedVehicleInfo) return null;
  
  const basePrice = selectedVehicleInfo.basePrice;
  
  // Vérifier si la distance est inférieure à la distance minimale du véhicule
  const minDistance = selectedVehicleInfo.min_trip_distance || 0;
  const adjustedDistance = Math.max(estimatedDistance, minDistance);
  const adjustedReturnDistance = Math.max(returnDistance, minDistance);
  
  // Notification pour distance minimale
  const hasMinDistanceWarning = estimatedDistance < minDistance && minDistance > 0;
  
  // Vérifier si les tarifs de nuit doivent être appliqués
  const isNightRate = isNightTime(date, time, selectedVehicleInfo, pricingSettings);
  
  // Utiliser en priorité les paramètres du véhicule pour les tarifs du dimanche
  const isSundayRate = isSunday(date);
  
  // Calculer la partie du trajet qui est en tarif de nuit
  const rideTime = time || "12:00";
  const { nightMinutes, totalMinutes } = calculateNightDuration(
    date, 
    rideTime, 
    estimatedDistance > 0 ? Math.max(10, estimatedDistance * 2) : 0, // Approximation de la durée en minutes
    selectedVehicleInfo,
    pricingSettings
  );
  
  // Prioriser les paramètres de tarifs spécifiques au véhicule
  const nightRatePercentage = selectedVehicleInfo.night_rate_enabled ? 
    (selectedVehicleInfo.night_rate_percentage || 0) : 
    (pricingSettings?.night_rate_percentage || 0);
  
  const holidaySundayPercentage = selectedVehicleInfo.holiday_sunday_percentage !== undefined ?
    selectedVehicleInfo.holiday_sunday_percentage :
    (pricingSettings?.holiday_sunday_percentage || 0);
  
  // Calculer les prix avec les distances ajustées
  let oneWayPriceHT = adjustedDistance * basePrice;
  let returnPriceHT = hasReturnTrip ? (returnToSameAddress ? adjustedDistance * basePrice : adjustedReturnDistance * basePrice) : 0;
  
  let nightSurcharge = 0;
  let sundaySurcharge = 0;
  
  // Si une partie du trajet est de nuit
  if (isNightRate && nightRatePercentage > 0) {
    // Calculer la proportion du trajet qui est en tarif de nuit
    const nightProportion = totalMinutes > 0 ? nightMinutes / totalMinutes : 0;
    
    // Appliquer la surcharge de nuit uniquement à la partie nocturne
    const oneWayNightPriceHT = oneWayPriceHT * nightProportion;
    const returnNightPriceHT = returnPriceHT * nightProportion;
    
    nightSurcharge = (oneWayNightPriceHT + returnNightPriceHT) * (nightRatePercentage / 100);
    
    // Ajouter la surcharge au prix total
    oneWayPriceHT += oneWayNightPriceHT * (nightRatePercentage / 100);
    returnPriceHT += returnNightPriceHT * (nightRatePercentage / 100);
  }
  
  if (isSundayRate && holidaySundayPercentage > 0) {
    const sundayPercentage = holidaySundayPercentage / 100;
    sundaySurcharge = (oneWayPriceHT + returnPriceHT) * sundayPercentage;
    oneWayPriceHT += oneWayPriceHT * sundayPercentage;
    returnPriceHT += returnPriceHT * sundayPercentage;
  }
  
  // Appliquer le tarif minimum si défini pour ce véhicule
  const minimumTripFare = selectedVehicleInfo.minimum_trip_fare || (pricingSettings?.minimum_trip_fare || 0);
  if (minimumTripFare > 0 && (oneWayPriceHT + returnPriceHT) < minimumTripFare) {
    const ratio = oneWayPriceHT / (oneWayPriceHT + returnPriceHT);
    oneWayPriceHT = minimumTripFare * ratio;
    returnPriceHT = minimumTripFare * (1 - ratio);
  }
  
  const waitingTimePriceHT = hasWaitingTime ? waitingTimePrice : 0;
  
  const rideVatRate = pricingSettings?.ride_vat_rate !== undefined ? pricingSettings.ride_vat_rate : 10;
  const waitingVatRate = pricingSettings?.waiting_vat_rate !== undefined ? pricingSettings.waiting_vat_rate : 20;
  
  const oneWayPrice = oneWayPriceHT * (1 + (rideVatRate / 100));
  const returnPrice = returnPriceHT * (1 + (rideVatRate / 100));
  const waitingTimePriceTTC = waitingTimePriceHT * (1 + (waitingVatRate / 100));
  
  const totalPriceHT = oneWayPriceHT + returnPriceHT + waitingTimePriceHT;
  
  const rideVAT = (oneWayPriceHT + returnPriceHT) * (rideVatRate / 100);
  const waitingVAT = waitingTimePriceHT * (waitingVatRate / 100);
  const totalVAT = rideVAT + waitingVAT;
  
  const totalPrice = totalPriceHT + totalVAT;
  
  return {
    basePrice,
    isNightRate,
    isSunday: isSundayRate,
    oneWayPriceHT,
    oneWayPrice,
    returnPriceHT,
    returnPrice,
    waitingTimePriceHT,
    waitingTimePrice: waitingTimePriceTTC,
    totalPriceHT,
    totalVAT,
    totalPrice,
    nightSurcharge,
    sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning,
    minDistance,
    nightMinutes,
    totalMinutes,
    nightRatePercentage
  };
};
