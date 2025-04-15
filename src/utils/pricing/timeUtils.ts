
import { PricingSettings } from '@/types/quoteForm';

/**
 * Checks if a specific time is within night hours
 */
export const isNightTime = (
  date: Date,
  time: string,
  vehicleSettings: any,
  settings: PricingSettings | null
): boolean => {
  if (vehicleSettings && vehicleSettings.night_rate_enabled && 
      vehicleSettings.night_rate_start && vehicleSettings.night_rate_end) {
    const [hours, minutes] = time.split(':').map(Number);
    const tripTime = new Date(date);
    tripTime.setHours(hours);
    tripTime.setMinutes(minutes);
    
    const startTime = new Date(date);
    const [startHours, startMinutes] = vehicleSettings.night_rate_start.split(':').map(Number);
    startTime.setHours(startHours);
    startTime.setMinutes(startMinutes);
    
    const endTime = new Date(date);
    const [endHours, endMinutes] = vehicleSettings.night_rate_end.split(':').map(Number);
    endTime.setHours(endHours);
    endTime.setMinutes(endMinutes);
    
    return (
      (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
      (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
    );
  }
  
  if (!settings || !settings.night_rate_enabled || !settings.night_rate_start || !settings.night_rate_end) {
    return false;
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  const tripTime = new Date(date);
  tripTime.setHours(hours);
  tripTime.setMinutes(minutes);
  
  const startTime = new Date(date);
  const [startHours, startMinutes] = settings.night_rate_start.split(':').map(Number);
  startTime.setHours(startHours);
  startTime.setMinutes(startMinutes);
  
  const endTime = new Date(date);
  const [endHours, endMinutes] = settings.night_rate_end.split(':').map(Number);
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);
  
  return (
    (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
    (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
  );
};

/**
 * Checks if a date is a Sunday
 */
export const isSunday = (date: Date): boolean => {
  return date.getDay() === 0;
};

/**
 * Calculates the portion of a trip that falls within night hours
 */
export const calculateNightDuration = (
  startDate: Date,
  startTime: string,
  durationMinutes: number,
  vehicleSettings: any,
  globalSettings: PricingSettings | null
): { nightMinutes: number, totalMinutes: number, nightStartDisplay: string, nightEndDisplay: string } => {
  if ((!vehicleSettings?.night_rate_enabled && !globalSettings?.night_rate_enabled) || durationMinutes <= 0) {
    return { 
      nightMinutes: 0, 
      totalMinutes: durationMinutes,
      nightStartDisplay: '',
      nightEndDisplay: ''
    };
  }
  
  const nightStart = vehicleSettings?.night_rate_enabled ? 
    vehicleSettings.night_rate_start : 
    globalSettings?.night_rate_start;
  
  const nightEnd = vehicleSettings?.night_rate_enabled ? 
    vehicleSettings.night_rate_end : 
    globalSettings?.night_rate_end;
  
  if (!nightStart || !nightEnd) {
    return { 
      nightMinutes: 0, 
      totalMinutes: durationMinutes,
      nightStartDisplay: '',
      nightEndDisplay: ''
    };
  }
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const departureMinutes = startHours * 60 + startMinutes;
  
  const [nightStartHours, nightStartMins] = nightStart.split(':').map(Number);
  const nightStartMinutes = nightStartHours * 60 + nightStartMins;
  
  const [nightEndHours, nightEndMins] = nightEnd.split(':').map(Number);
  const nightEndMinutes = nightEndHours * 60 + nightEndMins;
  
  const arrivalMinutes = (departureMinutes + durationMinutes) % 1440;
  
  // Format time displays
  const formatTimeDisplay = (minutes: number) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  const tripStartTimeDisplay = formatTimeDisplay(departureMinutes);
  const tripEndTimeDisplay = formatTimeDisplay(departureMinutes + durationMinutes);
  
  let effectiveNightStartDisplay = formatTimeDisplay(nightStartMinutes);
  let effectiveNightEndDisplay = formatTimeDisplay(nightEndMinutes);
  
  if (nightStartMinutes > nightEndMinutes) {
    if (departureMinutes >= nightStartMinutes) {
      if (arrivalMinutes <= nightEndMinutes) {
        return { 
          nightMinutes: durationMinutes, 
          totalMinutes: durationMinutes,
          nightStartDisplay: tripStartTimeDisplay,
          nightEndDisplay: tripEndTimeDisplay
        };
      }
      else {
        const nightPortionMinutes = (1440 - departureMinutes) + nightEndMinutes;
        const nightEndTime = Math.min(departureMinutes + durationMinutes, 1440) % 1440;
        if (nightEndTime <= nightEndMinutes) {
          effectiveNightEndDisplay = formatTimeDisplay(nightEndTime);
        } else {
          effectiveNightEndDisplay = formatTimeDisplay(nightEndMinutes);
        }
        return { 
          nightMinutes: Math.min(nightPortionMinutes, durationMinutes), 
          totalMinutes: durationMinutes,
          nightStartDisplay: tripStartTimeDisplay,
          nightEndDisplay: effectiveNightEndDisplay
        };
      }
    }
    else if (departureMinutes < nightEndMinutes) {
      if (arrivalMinutes <= nightEndMinutes) {
        return { 
          nightMinutes: durationMinutes, 
          totalMinutes: durationMinutes,
          nightStartDisplay: tripStartTimeDisplay,
          nightEndDisplay: tripEndTimeDisplay
        };
      }
      else {
        return { 
          nightMinutes: nightEndMinutes - departureMinutes, 
          totalMinutes: durationMinutes,
          nightStartDisplay: tripStartTimeDisplay,
          nightEndDisplay: effectiveNightEndDisplay
        };
      }
    }
    else {
      if (arrivalMinutes < nightStartMinutes) {
        return { 
          nightMinutes: 0, 
          totalMinutes: durationMinutes,
          nightStartDisplay: '',
          nightEndDisplay: ''
        };
      }
      else {
        const nightPortion = arrivalMinutes < 1440 ? 
          arrivalMinutes - nightStartMinutes : 
          1440 - nightStartMinutes;
        return { 
          nightMinutes: nightPortion, 
          totalMinutes: durationMinutes,
          nightStartDisplay: formatTimeDisplay(nightStartMinutes),
          nightEndDisplay: tripEndTimeDisplay
        };
      }
    }
  }
  else {
    const courseStart = departureMinutes;
    const courseEnd = departureMinutes + durationMinutes;
    
    if (courseEnd <= nightStartMinutes || courseStart >= nightEndMinutes) {
      return { 
        nightMinutes: 0, 
        totalMinutes: durationMinutes,
        nightStartDisplay: '',
        nightEndDisplay: ''
      };
    }
    
    if (courseStart >= nightStartMinutes && courseEnd <= nightEndMinutes) {
      return { 
        nightMinutes: durationMinutes, 
        totalMinutes: durationMinutes,
        nightStartDisplay: tripStartTimeDisplay,
        nightEndDisplay: tripEndTimeDisplay
      };
    }
    
    if (courseStart < nightStartMinutes && courseEnd <= nightEndMinutes) {
      return { 
        nightMinutes: courseEnd - nightStartMinutes, 
        totalMinutes: durationMinutes,
        nightStartDisplay: formatTimeDisplay(nightStartMinutes),
        nightEndDisplay: tripEndTimeDisplay
      };
    }
    
    if (courseStart >= nightStartMinutes && courseEnd > nightEndMinutes) {
      return { 
        nightMinutes: nightEndMinutes - courseStart, 
        totalMinutes: durationMinutes,
        nightStartDisplay: tripStartTimeDisplay,
        nightEndDisplay: formatTimeDisplay(nightEndMinutes)
      };
    }
    
    return { 
      nightMinutes: nightEndMinutes - nightStartMinutes, 
      totalMinutes: durationMinutes,
      nightStartDisplay: formatTimeDisplay(nightStartMinutes),
      nightEndDisplay: formatTimeDisplay(nightEndMinutes)
    };
  }
};
