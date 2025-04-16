
import { isNightTime } from './timeUtils';

/**
 * Calculate estimated night hours for a trip
 */
export const calculateNightHours = (
  startTime: string,
  totalMinutes: number,
  nightStartHour: number = 20,
  nightEndHour: number = 6
): {
  nightMinutes: number;
  totalMinutes: number;
  nightHours: number;
  dayHours: number;
  percentageNight: number;
} => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentTime = new Date();
  currentTime.setHours(hours, minutes, 0, 0);
  
  let nightMinutes = 0;
  let totalTripMinutes = totalMinutes;
  
  // Check each minute of the trip
  for (let i = 0; i < totalMinutes; i++) {
    if (isNightTime(currentTime, nightStartHour, nightEndHour)) {
      nightMinutes++;
    }
    
    // Advance time by 1 minute
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }
  
  // Calculate hours
  const nightHours = nightMinutes / 60;
  const dayHours = (totalMinutes - nightMinutes) / 60;
  
  // Calculate percentage
  const percentageNight = (nightMinutes / totalMinutes) * 100;
  
  return {
    nightMinutes,
    totalMinutes,
    nightHours,
    dayHours,
    percentageNight
  };
};
