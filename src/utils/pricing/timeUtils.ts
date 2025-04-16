
// Convert a time string (e.g., "20:00") to minutes since midnight
const timeStringToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check if a given timestamp is within night hours
export const isNightTime = (timestamp, nightStartTime, nightEndTime) => {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const nightStart = timeStringToMinutes(nightStartTime);
  const nightEnd = timeStringToMinutes(nightEndTime);
  
  // Si les heures de nuit traversent minuit (par exemple, 20:00 à 06:00)
  if (nightStart > nightEnd) {
    return totalMinutes >= nightStart || totalMinutes <= nightEnd;
  } else {
    // Heures de nuit dans la même journée (par exemple, 00:00 à 06:00)
    return totalMinutes >= nightStart && totalMinutes <= nightEnd;
  }
};

// Check if a given date is a Sunday
export const isSunday = (date) => {
  return date.getDay() === 0;
};

// Calculate the duration of night hours during a trip
export const calculateNightDuration = (startTime, endTime, nightStartTime, nightEndTime) => {
  // Convert night time strings to minutes from midnight
  const nightStart = timeStringToMinutes(nightStartTime);
  const nightEnd = timeStringToMinutes(nightEndTime);
  
  // Total trip duration in minutes
  const tripDuration = (endTime.getTime() - startTime.getTime()) / 60000; // milliseconds to minutes
  
  // Check if night time spans across midnight
  const nightSpansMidnight = nightStart > nightEnd;
  
  let nightMinutes = 0;
  
  // Start by getting the minutes from midnight for both start and end time
  const startMinutesFromMidnight = startTime.getHours() * 60 + startTime.getMinutes();
  let endMinutesFromMidnight = endTime.getHours() * 60 + endTime.getMinutes();
  
  // If the trip spans multiple days, adjust the end time
  if (endTime.getDate() !== startTime.getDate() || endTime.getMonth() !== startTime.getMonth() || endTime.getFullYear() !== startTime.getFullYear()) {
    // Each day past the start day adds 24 hours (1440 minutes)
    const daysDifference = Math.floor((endTime.getTime() - startTime.getTime()) / (24 * 60 * 60 * 1000));
    endMinutesFromMidnight += daysDifference * 1440;
  }
  
  // If night spans midnight
  if (nightSpansMidnight) {
    // Check if start time is in the night period (after night start or before night end)
    if (startMinutesFromMidnight >= nightStart) {
      // Start time is after night start but before midnight
      // Calculate minutes from start to midnight
      const minutesToMidnight = 1440 - startMinutesFromMidnight;
      
      // If end time is after midnight
      if (endMinutesFromMidnight > 1440) {
        const endMinutesAdjusted = endMinutesFromMidnight % 1440;
        
        if (endMinutesAdjusted <= nightEnd) {
          // Trip ends during night period after midnight
          nightMinutes = minutesToMidnight + endMinutesAdjusted;
        } else {
          // Trip ends after night period
          nightMinutes = minutesToMidnight + nightEnd;
        }
      } else {
        // Trip ends before midnight
        nightMinutes = endMinutesFromMidnight - startMinutesFromMidnight;
      }
    } else if (startMinutesFromMidnight < nightEnd) {
      // Start time is after midnight but before night end
      if (endMinutesFromMidnight <= nightEnd) {
        // Trip ends before night end
        nightMinutes = endMinutesFromMidnight - startMinutesFromMidnight;
      } else {
        // Trip ends after night end
        nightMinutes = nightEnd - startMinutesFromMidnight;
      }
    } else {
      // Start time is during the day
      
      // Check if the trip extends to the next night period
      if (endMinutesFromMidnight > nightStart) {
        // Trip extends into night period
        if (endMinutesFromMidnight < 1440) {
          // Trip ends before midnight
          nightMinutes = endMinutesFromMidnight - nightStart;
        } else {
          // Trip extends past midnight
          const endMinutesAdjusted = endMinutesFromMidnight % 1440;
          
          // Calculate night minutes before midnight
          const nightBeforeMidnight = 1440 - nightStart;
          
          // Calculate night minutes after midnight (up to night end or end time)
          const nightAfterMidnight = endMinutesAdjusted <= nightEnd ? 
            endMinutesAdjusted : nightEnd;
          
          nightMinutes = nightBeforeMidnight + nightAfterMidnight;
        }
      }
    }
  } else {
    // Night is within the same day (e.g., 22:00 to 23:59)
    
    // Check if any part of the trip falls within night hours
    if (startMinutesFromMidnight < nightEnd && endMinutesFromMidnight > nightStart) {
      const tripStartInNight = Math.max(startMinutesFromMidnight, nightStart);
      const tripEndInNight = Math.min(endMinutesFromMidnight, nightEnd);
      nightMinutes = Math.max(0, tripEndInNight - tripStartInNight);
    }
  }
  
  return {
    nightMinutes: Math.min(nightMinutes, tripDuration),
    totalMinutes: tripDuration
  };
};

// Calculate the split between day and night kilometers
export const calculateDayNightKmSplit = (
  startTime,
  endTime,
  totalDistance,
  nightStartTime,
  nightEndTime
) => {
  const { nightMinutes, totalMinutes } = calculateNightDuration(
    startTime,
    endTime,
    nightStartTime,
    nightEndTime
  );
  
  // Protection contre les divisions par zéro
  if (totalMinutes === 0) {
    return {
      dayKm: totalDistance,
      nightKm: 0,
      totalKm: totalDistance,
      dayPercentage: 100,
      nightPercentage: 0
    };
  }
  
  // Calculate proportion of the trip that happens during night hours
  const nightProportion = nightMinutes / totalMinutes;
  
  // Calculate day and night kilometers
  const nightKm = totalDistance * nightProportion;
  const dayKm = totalDistance - nightKm;
  
  // Protection contre les erreurs de calcul dues aux arrondis
  const dayPercentage = Math.max(0, Math.min(100, ((totalDistance - nightKm) / totalDistance) * 100));
  const nightPercentage = Math.max(0, Math.min(100, (nightKm / totalDistance) * 100));
  
  return {
    dayKm,
    nightKm,
    totalKm: totalDistance,
    dayPercentage,
    nightPercentage
  };
};
