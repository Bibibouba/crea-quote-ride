
import { QuoteDetailsType } from "@/types/quoteForm";

export interface TripTimes {
  tripEndTime: Date;
  waitEndTime: Date;
  returnEndTime?: Date;
}

export const calculateTripTimes = (
  date: Date | undefined,
  time: string,
  estimatedDuration: number,
  hasWaitingTime: boolean,
  waitingTimeMinutes: number,
  hasReturnTrip: boolean,
  returnDuration: number
): TripTimes => {
  // Ensure we have a valid date
  const validDate = date instanceof Date && !isNaN(date.getTime()) 
    ? new Date(date) 
    : new Date();
  
  // Validate time format and parse
  const timePattern = /^(\d{1,2}):(\d{2})$/;
  const matches = time.match(timePattern);
  
  let hours = 0;
  let minutes = 0;
  
  if (matches) {
    hours = parseInt(matches[1], 10);
    minutes = parseInt(matches[2], 10);
    
    // Validate hours and minutes
    if (hours < 0 || hours > 23) hours = 0;
    if (minutes < 0 || minutes > 59) minutes = 0;
  } else {
    console.warn('Invalid time format provided to calculateTripTimes:', time);
  }

  // Set the start time
  const tripStartTime = new Date(validDate);
  tripStartTime.setHours(hours, minutes, 0, 0);
  
  // Calculate trip end time
  const tripEndTime = new Date(tripStartTime);
  tripEndTime.setMinutes(tripEndTime.getMinutes() + Math.max(0, estimatedDuration));

  // Calculate waiting end time
  const waitEndTime = hasWaitingTime && waitingTimeMinutes > 0
    ? new Date(tripEndTime.getTime() + Math.max(0, waitingTimeMinutes) * 60 * 1000)
    : new Date(tripEndTime);

  // Calculate return end time if applicable
  const returnEndTime = hasReturnTrip
    ? new Date(waitEndTime.getTime() + Math.max(0, returnDuration) * 60 * 1000)
    : undefined;

  return {
    tripEndTime,
    waitEndTime,
    returnEndTime
  };
};
