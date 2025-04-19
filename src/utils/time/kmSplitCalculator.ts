
import { isNightTime } from './nightTimeChecker';

/**
 * Calculates the distribution of kilometers between day and night for a trip
 * based on the trip start time, total distance, and defined night hours.
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
  // For very short trips, avoid complex calculations
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

  // Estimate trip duration (approximate 1 hour per 60km)
  const estimatedDurationHours = totalDistance / 60;
  const estimatedDurationMinutes = estimatedDurationHours * 60;
  
  // Check every minute of the trip to determine if it's day or night
  let nightMinutes = 0;
  let totalMinutes = Math.round(estimatedDurationMinutes);
  
  const currentTime = new Date(startTime);
  for (let i = 0; i < totalMinutes; i++) {
    if (isNightTime(currentTime, nightStartTime, nightEndTime)) {
      nightMinutes++;
    }
    // Advance time by 1 minute
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }
  
  // Calculate time percentages
  const dayMinutes = totalMinutes - nightMinutes;
  const dayPercentage = (dayMinutes / totalMinutes) * 100;
  const nightPercentage = (nightMinutes / totalMinutes) * 100;
  
  // Calculate kilometer distribution based on time percentages
  const dayKm = Math.round((dayPercentage / 100) * totalDistance * 100) / 100;
  const nightKm = Math.round(totalDistance - dayKm);
  
  // Convert minutes to hours for reporting
  const dayHours = dayMinutes / 60;
  const nightHours = nightMinutes / 60;
  
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
