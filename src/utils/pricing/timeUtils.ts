
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
  
  // Vérifier si le trajet se déroule pendant la nuit
  let nightMinutes = 0;
  
  // Début du voyage après l'heure de début de nuit du jour du départ
  const tripStartsAfterNightStart = tripStartDate >= nightStartDate;
  
  // Fin du voyage après l'heure de début de nuit
  const tripEndsAfterNightStart = tripEndDate >= nightStartDate;
  
  // Début du voyage avant la fin de la période de nuit (soit le même jour, soit le jour suivant)
  const tripStartsBeforeNightEnd = tripStartDate < nightEndDate;
  
  // Fin du voyage avant la fin de la période de nuit
  const tripEndsBeforeNightEnd = tripEndDate <= nightEndDate;
  
  // Cas 1: Le trajet commence avant la nuit et se termine après le début de la nuit
  if (!tripStartsAfterNightStart && tripEndsAfterNightStart) {
    // Portion de nuit du trajet = de nightStartDate à min(tripEndDate, nightEndDate)
    const nightPortionEnd = tripEndDate < nightEndDate ? tripEndDate : nightEndDate;
    nightMinutes += (nightPortionEnd.getTime() - nightStartDate.getTime()) / 60000;
  }
  
  // Cas 2: Le trajet commence pendant la nuit
  if (tripStartsAfterNightStart && tripStartsBeforeNightEnd) {
    // Portion de nuit = de tripStartDate à min(tripEndDate, nightEndDate)
    const nightPortionEnd = tripEndDate < nightEndDate ? tripEndDate : nightEndDate;
    nightMinutes += (nightPortionEnd.getTime() - tripStartDate.getTime()) / 60000;
  }
  
  // Cas 3: Pour les trajets de plusieurs jours
  if (tripEndDate.getDate() > tripStartDate.getDate()) {
    // Nombre de jours complets entre le départ et l'arrivée
    const daysDiff = Math.floor((tripEndDate.getTime() - tripStartDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysDiff > 0) {
      // Calculer la durée de la nuit en minutes
      let nightDurationInMinutes;
      
      if (nightEndDate.getDate() > nightStartDate.getDate()) {
        // Si la période de nuit chevauche minuit (ex: 20:00 - 06:00)
        nightDurationInMinutes = (nightEndDate.getTime() - nightStartDate.getTime()) / 60000;
      } else {
        // Si la période de nuit est dans la même journée (ex: 22:00 - 23:59)
        nightDurationInMinutes = ((nightEndDate.getTime() + 24 * 60 * 60 * 1000) - nightStartDate.getTime()) / 60000;
      }
      
      // Ajouter les minutes de nuit pour chaque jour complet
      nightMinutes += daysDiff * nightDurationInMinutes;
      
      // Pour le dernier jour, si le trajet se termine avant la fin de la période de nuit
      const lastDayNightStartDate = new Date(tripEndDate);
      lastDayNightStartDate.setHours(nightStartHours, nightStartMinutes, 0, 0);
      
      const lastDayNightEndDate = new Date(tripEndDate);
      lastDayNightEndDate.setHours(nightEndHours, nightEndMinutes, 0, 0);
      
      if (lastDayNightEndDate <= lastDayNightStartDate) {
        lastDayNightEndDate.setDate(lastDayNightEndDate.getDate() + 1);
      }
      
      if (tripEndDate >= lastDayNightStartDate && tripEndDate <= lastDayNightEndDate) {
        nightMinutes += (tripEndDate.getTime() - lastDayNightStartDate.getTime()) / 60000;
      }
    }
  }
  
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
  
  return {
    dayKm: Math.round(dayKm * 100) / 100, // Arrondir à 2 décimales
    nightKm: Math.round(nightKm * 100) / 100,
    totalKm: totalDistance
  };
};
