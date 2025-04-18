
import { isNightTime } from './nightTimeChecker';

interface NightDurationResult {
  nightMinutes: number;
  totalMinutes: number;
  nightHours: number;
  dayHours: number;
  percentageNight: number;
  isNightRateApplied: boolean;
}

/**
 * Calculate night hours for a trip
 */
export const calculateNightDuration = (
  startTime: Date,
  endTime: Date,
  nightStartTime: string,
  nightEndTime: string
): NightDurationResult => {
  const tripDuration = (endTime.getTime() - startTime.getTime()) / 60000; // milliseconds to minutes
  let nightMinutes = 0;
  
  // Check each minute of the trip
  const currentTime = new Date(startTime);
  while (currentTime <= endTime) {
    if (isNightTime(currentTime, nightStartTime, nightEndTime)) {
      nightMinutes++;
    }
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }
  
  // Calculate hours and percentages
  const nightHours = nightMinutes / 60;
  const dayHours = (tripDuration - nightMinutes) / 60;
  const percentageNight = (nightMinutes / tripDuration) * 100;
  
  return {
    nightMinutes,
    totalMinutes: tripDuration,
    nightHours,
    dayHours,
    percentageNight,
    isNightRateApplied: nightMinutes > 0
  };
};

