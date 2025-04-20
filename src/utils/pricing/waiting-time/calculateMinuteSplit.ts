
interface MinuteSplitResult {
  dayMinutes: number;
  nightMinutes: number;
  waitEndTime: Date;
}

export const calculateMinuteSplit = (
  waitStartDate: Date,
  waitingTimeMinutes: number,
  nightStartTime: string,
  nightEndTime: string
): MinuteSplitResult => {
  let dayMinutes = 0;
  let nightMinutes = 0;
  
  // Check each minute of the waiting time
  let currentMinute = new Date(waitStartDate);
  const waitEndTime = new Date(waitStartDate.getTime() + waitingTimeMinutes * 60000);
  
  while (currentMinute < waitEndTime) {
    if (isNightTime(currentMinute, nightStartTime, nightEndTime)) {
      nightMinutes++;
    } else {
      dayMinutes++;
    }
    
    // Advance time by 1 minute
    currentMinute.setMinutes(currentMinute.getMinutes() + 1);
  }
  
  // Verify total minutes and adjust if needed
  const totalCalculatedMinutes = dayMinutes + nightMinutes;
  if (totalCalculatedMinutes !== waitingTimeMinutes) {
    if (totalCalculatedMinutes < waitingTimeMinutes) {
      dayMinutes += (waitingTimeMinutes - totalCalculatedMinutes);
    } else if (totalCalculatedMinutes > waitingTimeMinutes) {
      const ratio = waitingTimeMinutes / totalCalculatedMinutes;
      dayMinutes = Math.round(dayMinutes * ratio);
      nightMinutes = waitingTimeMinutes - dayMinutes;
    }
  }
  
  return { dayMinutes, nightMinutes, waitEndTime };
};

import { isNightTime } from './isNightTime';
