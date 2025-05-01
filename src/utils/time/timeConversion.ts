
/**
 * Convert a time string (HH:MM format) to minutes since midnight
 */
export const timeStringToMinutes = (timeString: string): number => {
  if (!timeString || typeof timeString !== 'string') {
    console.warn('Invalid time string provided to timeStringToMinutes:', timeString);
    return 0;
  }
  
  const parts = timeString.split(':');
  if (parts.length !== 2) {
    console.warn('Invalid time format, expected HH:MM:', timeString);
    return 0;
  }
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) {
    console.warn('Invalid time values, could not parse to numbers:', timeString);
    return 0;
  }
  
  return hours * 60 + minutes;
};

/**
 * Format a date object to time string (HH:MM)
 */
export const formatTimeToString = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to formatTimeToString:', date);
    return '00:00';
  }
  
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
