
import { timeStringToMinutes } from './timeConversion';

/**
 * Vérifie si un timestamp donné tombe dans les heures de nuit
 */
export const isNightTime = (timestamp: Date, nightStartTime: string, nightEndTime: string): boolean => {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const nightStart = timeStringToMinutes(nightStartTime);
  const nightEnd = timeStringToMinutes(nightEndTime);
  
  console.log(`Checking if ${hours}:${minutes} (${totalMinutes}) is night time. Night hours: ${nightStartTime}-${nightEndTime} (${nightStart}-${nightEnd})`);
  
  // Si les heures de nuit traversent minuit
  if (nightStart > nightEnd) {
    const isNight = totalMinutes >= nightStart || totalMinutes <= nightEnd;
    console.log(`Night crosses midnight: ${isNight ? 'IS night time' : 'is NOT night time'}`);
    return isNight;
  } else {
    // Heures de nuit dans la même journée
    const isNight = totalMinutes >= nightStart && totalMinutes <= nightEnd;
    console.log(`Night same day: ${isNight ? 'IS night time' : 'is NOT night time'}`);
    return isNight;
  }
};

/**
 * Vérifie si une heure et minute spécifiques tombent dans les heures de nuit
 * Utilisé pour déterminer si un segment de trajet commence ou se termine pendant les heures de nuit
 */
export const isWithinNightHours = (
  hour: number,
  minute: number,
  nightStartHour: number,
  nightStartMinute: number,
  nightEndHour: number,
  nightEndMinute: number
): boolean => {
  const totalMinutes = hour * 60 + minute;
  const nightStart = nightStartHour * 60 + nightStartMinute;
  const nightEnd = nightEndHour * 60 + nightEndMinute;
  
  console.log(`Checking if ${hour}:${minute} (${totalMinutes}) is within night hours ${nightStartHour}:${nightStartMinute}-${nightEndHour}:${nightEndMinute} (${nightStart}-${nightEnd})`);
  
  // Si les heures de nuit traversent minuit
  if (nightStart > nightEnd) {
    const isNight = totalMinutes >= nightStart || totalMinutes <= nightEnd;
    console.log(`Night crosses midnight: ${isNight ? 'IS within night hours' : 'is NOT within night hours'}`);
    return isNight;
  } else {
    // Heures de nuit dans la même journée
    const isNight = totalMinutes >= nightStart && totalMinutes <= nightEnd;
    console.log(`Night same day: ${isNight ? 'IS within night hours' : 'is NOT within night hours'}`);
    return isNight;
  }
};

/**
 * Vérifie si une date donnée est un dimanche
 */
export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};
