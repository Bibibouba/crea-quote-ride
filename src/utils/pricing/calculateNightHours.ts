
/**
 * Calculate estimated night hours for a trip
 */
export const calculateNightHours = (
  hours: number,
  minutes: number,
  durationMinutes: number,
  nightStartHour: number = 20,
  nightStartMinutes: number = 0,
  nightEndHour: number = 6,
  nightEndMinutes: number = 0
): {
  nightMinutes: number;
  totalMinutes: number;
  nightHours: number;
  dayHours: number;
  percentageNight: number;
  isNightRateApplied: boolean;
} => {
  let currentTime = new Date();
  currentTime.setHours(hours, minutes, 0, 0);
  
  let nightMinutes = 0;
  let totalTripMinutes = durationMinutes;
  
  // Check each minute of the trip
  for (let i = 0; i < durationMinutes; i++) {
    if (isNightTime(currentTime, `${nightStartHour}:${nightStartMinutes}`, `${nightEndHour}:${nightEndMinutes}`)) {
      nightMinutes++;
    }
    
    // Advance time by 1 minute
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }
  
  // Calculate hours
  const nightHours = nightMinutes / 60;
  const dayHours = (durationMinutes - nightMinutes) / 60;
  
  // Calculate percentage
  const percentageNight = (nightMinutes / durationMinutes) * 100;
  
  return {
    nightMinutes,
    totalMinutes: durationMinutes,
    nightHours,
    dayHours,
    percentageNight,
    isNightRateApplied: nightMinutes > 0
  };
};

// Helper function to check if a given time is within night hours
const isNightTime = (timestamp: Date, nightStartTime: string, nightEndTime: string): boolean => {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const [nightStartHours, nightStartMinutes] = nightStartTime.split(':').map(Number);
  const [nightEndHours, nightEndMinutes] = nightEndTime.split(':').map(Number);
  
  const nightStart = nightStartHours * 60 + nightStartMinutes;
  const nightEnd = nightEndHours * 60 + nightEndMinutes;
  
  // If night hours cross midnight
  if (nightStart > nightEnd) {
    return totalMinutes >= nightStart || totalMinutes <= nightEnd;
  } else {
    return totalMinutes >= nightStart && totalMinutes <= nightEnd;
  }
};
