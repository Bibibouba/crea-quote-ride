
import { VehiclePricingSettings } from '@/types/vehiclePricing';

export type QuoteCalculationInput = {
  vehicleSettings: VehiclePricingSettings;
  distanceKm: number;
  durationMinutes: number;
  waitTimeMinutes: number;
  departureTime: string; // HH:mm
  departureDate: Date;
  hasReturnTrip?: boolean;
  returnToSameAddress?: boolean;
  returnDistance?: number;
};

export type QuoteDetailsType = {
  dayKm: number;
  nightKm: number;
  totalKm: number;
  dayPrice: number;
  nightPrice: number;
  waitPrice: number;
  waitPriceDay?: number;
  waitPriceNight?: number;
  waitTimeDay?: number;
  waitTimeNight?: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
  details: string[];
  // Champs supplémentaires pour compatibilité avec la structure existante
  basePrice?: number;
  isNightRate?: boolean;
  isSunday?: boolean;
  oneWayPriceHT?: number;
  returnPriceHT?: number;
  waitingTimePriceHT?: number;
  totalPriceHT?: number;
  totalVAT?: number;
  oneWayPrice?: number;
  returnPrice?: number;
  waitingTimePrice?: number;
  totalPrice?: number;
  nightSurcharge?: number;
  sundaySurcharge?: number;
  rideVatRate?: number;
  waitingVatRate?: number;
  hasMinDistanceWarning?: boolean;
  minDistance?: number;
  nightMinutes?: number;
  totalMinutes?: number;
  nightRatePercentage?: number;
  nightHours?: number;
  dayHours?: number;
  nightStartDisplay?: string;
  nightEndDisplay?: string;
  sundayRate?: number;
};

/**
 * Convertit une heure au format HH:mm en minutes depuis minuit
 */
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Vérifie si une valeur en minutes se trouve dans la plage de nuit
 */
function isInNightRange(value: number, start: number, end: number): boolean {
  return start < end ? value >= start && value < end : value >= start || value < end;
}

/**
 * Découpe la durée du trajet en minutes de jour et minutes de nuit
 */
function splitDurationByNightRange(startTime: string, duration: number, nightStart: string, nightEnd: string): { 
  dayMinutes: number; 
  nightMinutes: number;
  nightStartDisplay: string;
  nightEndDisplay: string;
} {
  const nightStartMin = parseTimeToMinutes(nightStart);
  const nightEndMin = parseTimeToMinutes(nightEnd);
  const result = { 
    dayMinutes: 0, 
    nightMinutes: 0,
    nightStartDisplay: nightStart,
    nightEndDisplay: nightEnd
  };
  
  let currentMin = parseTimeToMinutes(startTime);

  for (let i = 0; i < duration; i++) {
    if (isInNightRange(currentMin % 1440, nightStartMin, nightEndMin)) {
      result.nightMinutes++;
    } else {
      result.dayMinutes++;
    }
    currentMin++;
  }
  
  return result;
}

/**
 * Calcule la répartition des kilomètres en fonction du temps passé de jour et de nuit
 */
function calculateKmByTimeSplit(dayMinutes: number, nightMinutes: number, totalKm: number): { 
  dayKm: number; 
  nightKm: number;
  totalKm: number;
} {
  const totalMinutes = dayMinutes + nightMinutes;
  if (totalMinutes === 0) return { dayKm: totalKm, nightKm: 0, totalKm };
  
  const dayKm = (totalKm * dayMinutes) / totalMinutes;
  const nightKm = (totalKm * nightMinutes) / totalMinutes;
  
  return { 
    dayKm, 
    nightKm,
    totalKm
  };
}

/**
 * Vérifie si une date est un dimanche
 */
function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Calcule le prix d'attente, en tenant compte des périodes de jour et de nuit
 */
function calculateDetailedWaitPrice(
  waitMinutes: number, 
  settings: VehiclePricingSettings, 
  startTime: string,
  departureDate: Date
): { 
  totalWaitPrice: number;
  waitTimeDay: number;
  waitTimeNight: number;
  waitPriceDay: number;
  waitPriceNight: number;
} {
  if (waitMinutes <= 0 || !settings.wait_price_per_15min) {
    return { 
      totalWaitPrice: 0,
      waitTimeDay: 0,
      waitTimeNight: 0,
      waitPriceDay: 0,
      waitPriceNight: 0
    };
  }
  
  const nightStart = settings.wait_night_start ? parseTimeToMinutes(settings.wait_night_start) : 0;
  const nightEnd = settings.wait_night_end ? parseTimeToMinutes(settings.wait_night_end) : 0;
  const waitNightEnabled = settings.wait_night_enabled;
  
  let totalPrice = 0;
  let waitTimeDay = 0;
  let waitTimeNight = 0;
  let waitPriceDay = 0;
  let waitPriceNight = 0;
  
  let currentMin = parseTimeToMinutes(startTime);
  const baseWaitPrice = settings.wait_price_per_15min;
  
  // Diviser le temps d'attente en tranches de 15 minutes
  const quarters = Math.ceil(waitMinutes / 15);
  
  for (let i = 0; i < quarters; i++) {
    const isNight = waitNightEnabled && isInNightRange(currentMin % 1440, nightStart, nightEnd);
    const multiplier = isNight ? 1 + (settings.wait_night_percentage || 0) / 100 : 1;
    
    if (isNight) {
      waitTimeNight += 15;
      const quarterPrice = baseWaitPrice * multiplier;
      waitPriceNight += quarterPrice;
      totalPrice += quarterPrice;
    } else {
      waitTimeDay += 15;
      waitPriceDay += baseWaitPrice;
      totalPrice += baseWaitPrice;
    }
    
    currentMin += 15;
  }
  
  return { 
    totalWaitPrice: totalPrice,
    waitTimeDay,
    waitTimeNight,
    waitPriceDay,
    waitPriceNight
  };
}

/**
 * Fonction principale de calcul du devis
 */
export function calculateNewQuoteDetails(input: QuoteCalculationInput): QuoteDetailsType {
  // Récupérer les paramètres du véhicule
  const settings = input.vehicleSettings;
  const basePrice = settings.price_per_km || 1.8;
  
  // Paramètres de tarification nuit
  const nightRateEnabled = settings.night_rate_enabled || false;
  const nightStart = nightRateEnabled ? (settings.night_rate_start || "20:00") : "20:00";
  const nightEnd = nightRateEnabled ? (settings.night_rate_end || "06:00") : "06:00";
  const nightRatePercentage = nightRateEnabled ? (settings.night_rate_percentage || 0) : 0;

  // Découper le trajet en périodes de jour et de nuit
  const durationSplit = splitDurationByNightRange(
    input.departureTime,
    input.durationMinutes,
    nightStart,
    nightEnd
  );

  const dayMinutes = durationSplit.dayMinutes;
  const nightMinutes = durationSplit.nightMinutes;
  const nightStartDisplay = durationSplit.nightStartDisplay;
  const nightEndDisplay = durationSplit.nightEndDisplay;
  
  // Répartir les kilomètres en fonction du découpage jour/nuit
  const { dayKm, nightKm, totalKm } = calculateKmByTimeSplit(
    dayMinutes, 
    nightMinutes, 
    Math.max(input.distanceKm, settings.min_trip_distance || 0)
  );
  
  // Calculer les prix pour les portions jour et nuit
  const dayPrice = dayKm * basePrice;
  let nightPrice = 0;
  
  if (nightRateEnabled && nightMinutes > 0) {
    nightPrice = nightKm * basePrice * (1 + nightRatePercentage / 100);
  } else {
    nightPrice = nightKm * basePrice;
  }
  
  // Calculer le prix du temps d'attente
  const waitingDetails = calculateDetailedWaitPrice(
    input.waitTimeMinutes, 
    settings, 
    input.departureTime,
    input.departureDate
  );
  
  // Vérifier si le jour est un dimanche ou férié
  const isSundayOrHoliday = isSunday(input.departureDate);
  const sundayRate = settings.holiday_sunday_percentage || 0;
  
  // Calculer la majoration dimanche/férié si applicable
  let sundaySurcharge = 0;
  if (isSundayOrHoliday && sundayRate > 0) {
    const baseAmount = dayPrice + nightPrice + waitingDetails.totalWaitPrice;
    sundaySurcharge = baseAmount * (sundayRate / 100);
  }
  
  // Calculer le total HT (avant application du minimum)
  let subTotalHT = dayPrice + nightPrice + waitingDetails.totalWaitPrice + sundaySurcharge;
  
  // Appliquer le tarif minimum si nécessaire
  const minimumFare = settings.minimum_trip_fare || 0;
  if (minimumFare > 0 && subTotalHT < minimumFare) {
    subTotalHT = minimumFare;
  }
  
  // Calcul de la TVA et du total TTC
  const rideVatRate = 10; // Taux TVA par défaut pour les trajets (10%)
  const waitingVatRate = 20; // Taux TVA par défaut pour l'attente (20%)
  
  const rideVat = (dayPrice + nightPrice + sundaySurcharge) * (rideVatRate / 100);
  const waitingVat = waitingDetails.totalWaitPrice * (waitingVatRate / 100);
  const totalVat = rideVat + waitingVat;
  const totalTTC = subTotalHT + totalVat;
  
  // Construire les détails à afficher
  const details = [
    `${dayKm.toFixed(1)} km de jour à ${basePrice.toFixed(2)} €/km = ${dayPrice.toFixed(2)} €`,
  ];
  
  if (nightKm > 0 && nightRateEnabled) {
    details.push(`${nightKm.toFixed(1)} km de nuit à ${basePrice.toFixed(2)} €/km +${nightRatePercentage}% = ${nightPrice.toFixed(2)} €`);
  } else if (nightKm > 0) {
    details.push(`${nightKm.toFixed(1)} km de nuit à ${basePrice.toFixed(2)} €/km = ${nightPrice.toFixed(2)} €`);
  }
  
  if (waitingDetails.totalWaitPrice > 0) {
    details.push(`Temps d'attente : ${waitingDetails.totalWaitPrice.toFixed(2)} €`);
  }
  
  if (sundaySurcharge > 0) {
    details.push(`Majoration dimanche/férié (${sundayRate}%) : ${sundaySurcharge.toFixed(2)} €`);
  }
  
  details.push(`Total HT : ${subTotalHT.toFixed(2)} €`);
  details.push(`TVA : ${totalVat.toFixed(2)} €`);
  details.push(`Total TTC : ${totalTTC.toFixed(2)} €`);
  
  // Calculer les heures de jour et de nuit
  const nightHours = nightMinutes / 60;
  const dayHours = dayMinutes / 60;
  
  // Créer l'objet de retour détaillé
  return {
    dayKm,
    nightKm,
    totalKm,
    dayPrice,
    nightPrice,
    waitPrice: waitingDetails.totalWaitPrice,
    waitPriceDay: waitingDetails.waitPriceDay,
    waitPriceNight: waitingDetails.waitPriceNight,
    waitTimeDay: waitingDetails.waitTimeDay,
    waitTimeNight: waitingDetails.waitTimeNight,
    totalHT: subTotalHT,
    tva: totalVat,
    totalTTC,
    details,
    // Champs pour compatibilité avec la structure existante
    basePrice,
    isNightRate: nightMinutes > 0 && nightRateEnabled,
    isSunday: isSundayOrHoliday,
    oneWayPriceHT: dayPrice + nightPrice,
    waitingTimePriceHT: waitingDetails.totalWaitPrice,
    totalPriceHT: subTotalHT,
    totalVAT: totalVat,
    oneWayPrice: (dayPrice + nightPrice) * (1 + (rideVatRate / 100)),
    waitingTimePrice: waitingDetails.totalWaitPrice * (1 + (waitingVatRate / 100)),
    totalPrice: totalTTC,
    nightSurcharge: nightRateEnabled ? (nightKm * basePrice * nightRatePercentage / 100) : 0,
    sundaySurcharge,
    rideVatRate,
    waitingVatRate,
    hasMinDistanceWarning: input.distanceKm < (settings.min_trip_distance || 0),
    minDistance: settings.min_trip_distance,
    nightMinutes,
    totalMinutes: dayMinutes + nightMinutes,
    nightRatePercentage,
    nightHours,
    dayHours,
    nightStartDisplay,
    nightEndDisplay,
    sundayRate
  };
}
