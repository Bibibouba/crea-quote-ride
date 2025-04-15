/**
 * Vérifie si la date et l'heure spécifiées se situent pendant les heures de nuit
 */
export const isNightTime = (date: Date, time: string, vehicleSettings: any, pricingSettings: any): boolean => {
  const nightRateEnabled = vehicleSettings?.night_rate_enabled || pricingSettings?.night_rate_enabled;
  if (!nightRateEnabled) {
    return false;
  }

  const nightStart = vehicleSettings?.night_rate_start || pricingSettings?.night_rate_start || '20:00';
  const nightEnd = vehicleSettings?.night_rate_end || pricingSettings?.night_rate_end || '06:00';

  const [hours, minutes] = time.split(':').map(Number);
  const tripTime = new Date(date);
  tripTime.setHours(hours);
  tripTime.setMinutes(minutes);

  const startTime = new Date(date);
  const [startHours, startMinutes] = nightStart.split(':').map(Number);
  startTime.setHours(startHours);
  startTime.setMinutes(startMinutes);

  const endTime = new Date(date);
  const [endHours, endMinutes] = nightEnd.split(':').map(Number);
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);

  // Si la fin de nuit est avant le début, cela signifie qu'elle est le jour suivant
  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  return (
    (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
    (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
  );
};

/**
 * Vérifie si une date est un dimanche
 */
export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0; // 0 représente Dimanche dans JavaScript
};

/**
 * Calcule la durée du trajet en minutes et la portion effectuée pendant les heures de nuit
 */
export const calculateNightDuration = (
  date: Date,
  startTime: string,
  durationMinutes: number,
  vehicleSettings: any,
  pricingSettings: any
) => {
  // Obtenir les réglages de nuit, d'abord du véhicule puis des réglages généraux
  const nightRateEnabled = vehicleSettings?.night_rate_enabled || 
                           (pricingSettings?.night_rate_enabled || false);
  
  if (!nightRateEnabled) {
    return { 
      nightMinutes: 0, 
      totalMinutes: durationMinutes,
      nightStartDisplay: '',
      nightEndDisplay: ''
    };
  }
  
  const nightStart = vehicleSettings?.night_rate_start || 
                    pricingSettings?.night_rate_start || '20:00';
  
  const nightEnd = vehicleSettings?.night_rate_end || 
                  pricingSettings?.night_rate_end || '06:00';
  
  // Créer des objets Date pour le début et la fin de la nuit
  const [nightStartHours, nightStartMinutes] = nightStart.split(':').map(Number);
  const [nightEndHours, nightEndMinutes] = nightEnd.split(':').map(Number);
  
  // Création de l'heure de départ du trajet
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const tripStartDate = new Date(date);
  tripStartDate.setHours(startHours, startMinutes, 0, 0);
  
  // Création de l'heure de fin du trajet
  const tripEndDate = new Date(tripStartDate.getTime() + durationMinutes * 60000);
  
  // Dates pour la période de nuit du jour de départ
  const nightStartDate = new Date(date);
  nightStartDate.setHours(nightStartHours, nightStartMinutes, 0, 0);
  
  const nightEndDate = new Date(date);
  nightEndDate.setHours(nightEndHours, nightEndMinutes, 0, 0);
  
  // Si la fin de nuit est avant le début, cela signifie qu'elle est le jour suivant
  if (nightEndDate <= nightStartDate) {
    nightEndDate.setDate(nightEndDate.getDate() + 1);
  }
  
  // Pour le débogage
  console.log('Night calculation parameters:', {
    tripStartDate: tripStartDate.toLocaleTimeString(),
    tripEndDate: tripEndDate.toLocaleTimeString(),
    nightStartDate: nightStartDate.toLocaleTimeString(),
    nightEndDate: nightEndDate.toLocaleTimeString(),
    durationMinutes
  });
  
  // Vérifier si le trajet se déroule pendant la nuit
  let nightMinutes = 0;
  
  // Vérification minute par minute pour une plus grande précision
  // Cette méthode est plus précise mais peut être plus lente pour de très longs trajets
  for (let i = 0; i < durationMinutes; i++) {
    const currentMinute = new Date(tripStartDate.getTime() + i * 60000);
    let isNight = false;
    
    if (nightEndDate > nightStartDate) {
      // Cas simple : nuit dans la même journée (ex: 22:00 - 05:00)
      isNight = currentMinute >= nightStartDate && currentMinute < nightEndDate;
    } else {
      // Cas où la nuit chevauche minuit (ex: 22:00 - 05:00 le lendemain)
      const currentHour = currentMinute.getHours();
      const currentMin = currentMinute.getMinutes();
      const totalCurrentMinutes = currentHour * 60 + currentMin;
      const totalNightStartMinutes = nightStartHours * 60 + nightStartMinutes;
      const totalNightEndMinutes = nightEndHours * 60 + nightEndMinutes;
      
      isNight = totalCurrentMinutes >= totalNightStartMinutes || totalCurrentMinutes < totalNightEndMinutes;
    }
    
    if (isNight) {
      nightMinutes++;
    }
  }
  
  console.log('Night minutes calculated:', {
    nightMinutes,
    totalMinutes: durationMinutes,
    percentage: (nightMinutes / durationMinutes) * 100
  });
  
  // Retourner le résultat en arrondissant pour éviter des fractions
  return {
    nightMinutes: Math.round(Math.max(0, nightMinutes)),
    totalMinutes: durationMinutes,
    nightStartDisplay: nightStart,
    nightEndDisplay: nightEnd
  };
};

/**
 * Calcule la répartition des kilomètres entre jour et nuit en fonction
 * de la proportion de temps passé pendant les heures de nuit
 */
export const calculateDayNightKmSplit = (
  totalDistance: number,
  nightMinutes: number,
  totalMinutes: number
) => {
  if (totalMinutes === 0 || nightMinutes === 0) {
    return {
      dayKm: totalDistance,
      nightKm: 0,
      totalKm: totalDistance
    };
  }
  
  // Calculer la proportion de trajet effectuée pendant la nuit
  const nightProportion = nightMinutes / totalMinutes;
  
  // Répartir les kilomètres en fonction de cette proportion
  const nightKm = totalDistance * nightProportion;
  const dayKm = totalDistance - nightKm;
  
  console.log('Day/Night km split:', {
    totalDistance,
    nightProportion: nightProportion * 100 + '%',
    dayKm,
    nightKm
  });
  
  return {
    dayKm: Math.round(dayKm * 100) / 100, // Arrondir à 2 décimales
    nightKm: Math.round(nightKm * 100) / 100,
    totalKm: totalDistance
  };
};
