
import { calculateNightDuration } from './nightDurationCalculator';

interface KmSplitResult {
  dayKm: number;
  nightKm: number;
  totalKm: number;
  dayPercentage: number;
  nightPercentage: number;
  nightHours: number;
  dayHours: number;
  totalMinutes: number;
}

/**
 * Calculate the split between day and night kilometers
 */
export const calculateDayNightKmSplit = (
  startTime: Date,
  totalDistance: number,
  nightStartTime: string,
  nightEndTime: string
): KmSplitResult => {
  // Create end time based on distance (assuming average speed of 60km/h)
  const durationInMinutes = (totalDistance / 60) * 60;
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);
  
  const { nightMinutes, totalMinutes, nightHours, dayHours } = calculateNightDuration(
    startTime,
    endTime,
    nightStartTime,
    nightEndTime
  );
  
  // Protection against zero division
  if (totalMinutes === 0) {
    return {
      dayKm: totalDistance,
      nightKm: 0,
      totalKm: totalDistance,
      dayPercentage: 100,
      nightPercentage: 0,
      nightHours: 0,
      dayHours: 0,
      totalMinutes: 0
    };
  }
  
  // Calculate proportions
  const nightProportion = nightMinutes / totalMinutes;
  const nightKm = totalDistance * nightProportion;
  const dayKm = totalDistance - nightKm;
  
  // Calculate percentages with protection against rounding errors
  const dayPercentage = Math.max(0, Math.min(100, ((totalDistance - nightKm) / totalDistance) * 100));
  const nightPercentage = Math.max(0, Math.min(100, (nightKm / totalDistance) * 100));
  
  return {
    dayKm,
    nightKm,
    totalKm: totalDistance,
    dayPercentage,
    nightPercentage,
    nightHours,
    dayHours,
    totalMinutes
  };
};

