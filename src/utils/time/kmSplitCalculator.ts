
import { isNightTime } from './nightTimeChecker';

/**
 * Calcule la répartition des kilomètres entre jour et nuit pour un trajet
 * en fonction de l'heure de départ, de la distance totale et des heures de nuit définies.
 */
export const calculateDayNightKmSplit = (
  startTime: Date,
  totalDistance: number,
  nightStartTime: string,
  nightEndTime: string
): {
  dayKm: number;
  nightKm: number;
  dayPercentage: number;
  nightPercentage: number;
  dayHours: number;
  nightHours: number;
  totalKm: number;
} => {
  // Pour les trajets très courts, éviter les calculs complexes
  if (totalDistance < 1) {
    return {
      dayKm: totalDistance,
      nightKm: 0,
      dayPercentage: 100,
      nightPercentage: 0,
      dayHours: 0,
      nightHours: 0,
      totalKm: totalDistance
    };
  }

  // Estimer la durée du trajet (environ 1 heure pour 60km)
  const estimatedDurationHours = totalDistance / 60;
  const estimatedDurationMinutes = estimatedDurationHours * 60;
  
  // Vérifier chaque minute du trajet pour déterminer si c'est jour ou nuit
  let nightMinutes = 0;
  let totalMinutes = Math.round(estimatedDurationMinutes);
  
  const currentTime = new Date(startTime);
  console.log(`Calculating day/night split from ${currentTime.toTimeString()} with night hours ${nightStartTime}-${nightEndTime}`);

  for (let i = 0; i < totalMinutes; i++) {
    if (isNightTime(currentTime, nightStartTime, nightEndTime)) {
      nightMinutes++;
    }
    // Avancer le temps d'une minute
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }
  
  // Calculer les pourcentages de temps
  const dayMinutes = totalMinutes - nightMinutes;
  const dayPercentage = (dayMinutes / totalMinutes) * 100;
  const nightPercentage = (nightMinutes / totalMinutes) * 100;
  
  // Calculer la répartition des kilomètres basée sur les pourcentages de temps
  const dayKm = Math.round((dayPercentage / 100) * totalDistance * 100) / 100;
  const nightKm = Math.round((totalDistance - dayKm) * 100) / 100;
  
  // Convertir les minutes en heures pour les rapports
  const dayHours = dayMinutes / 60;
  const nightHours = nightMinutes / 60;
  
  console.log(`Day: ${dayPercentage.toFixed(1)}% (${dayKm.toFixed(1)}km), Night: ${nightPercentage.toFixed(1)}% (${nightKm.toFixed(1)}km)`);
  
  return {
    dayKm: dayKm,
    nightKm: nightKm,
    dayPercentage: Math.round(dayPercentage),
    nightPercentage: Math.round(nightPercentage),
    dayHours: Math.round(dayHours * 100) / 100,
    nightHours: Math.round(nightHours * 100) / 100,
    totalKm: totalDistance
  };
};
