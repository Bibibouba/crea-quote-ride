
import { timeStringToMinutes } from './timeConversion';

/**
 * Check if a given timestamp falls within night hours
 */
export const isNightTime = (timestamp: Date, nightStartTime: string, nightEndTime: string): boolean => {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const nightStart = timeStringToMinutes(nightStartTime);
  const nightEnd = timeStringToMinutes(nightEndTime);
  
  // If night hours cross midnight
  if (nightStart > nightEnd) {
    return totalMinutes >= nightStart || totalMinutes <= nightEnd;
  } else {
    // Night hours within same day
    return totalMinutes >= nightStart && totalMinutes <= nightEnd;
  }
};

/**
 * Check if a given date is a Sunday
 */
export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

