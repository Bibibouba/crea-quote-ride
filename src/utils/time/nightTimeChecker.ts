
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
 * Check if a specific hour and minute falls within night hours
 * Used for determining if a trip segment starts or ends during night time
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
