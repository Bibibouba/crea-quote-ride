
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
  if (!date) return { tripEndTime: new Date(), waitEndTime: new Date() };

  // Calculate trip end time
  const [hours, minutes] = time.split(':').map(Number);
  const tripEndTime = new Date(date);
  tripEndTime.setHours(hours);
  tripEndTime.setMinutes(minutes + estimatedDuration);

  // Calculate waiting end time
  let waitEndTime = hasWaitingTime ? 
    new Date(tripEndTime.getTime() + waitingTimeMinutes * 60 * 1000) : 
    tripEndTime;

  // Calculate return end time if applicable
  let returnEndTime = hasReturnTrip ? 
    new Date(waitEndTime.getTime() + returnDuration * 60 * 1000) : 
    undefined;

  return {
    tripEndTime,
    waitEndTime,
    returnEndTime
  };
};
