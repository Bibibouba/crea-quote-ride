
import React from 'react';
import { TripTimeInfo } from '../../summary/TripTimeInfo';
import { calculateTripTimes } from '@/utils/time/tripTimeCalculator';
import { QuoteDetailsType } from '@/types/quoteForm';

interface TripTimingDetailsProps {
  time: string;
  date?: Date;
  estimatedDuration: number;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  hasReturnTrip: boolean;
  returnDuration: number;
  quoteDetails?: QuoteDetailsType;
}

export const TripTimingDetails: React.FC<TripTimingDetailsProps> = ({
  time,
  date,
  estimatedDuration,
  hasWaitingTime,
  waitingTimeMinutes,
  hasReturnTrip,
  returnDuration,
  quoteDetails
}) => {
  // Ensure we have a valid date to work with
  const validDate = date instanceof Date && !isNaN(date.getTime()) 
    ? date 
    : new Date();
  
  // Ensure we have valid time string
  const validTimeString = typeof time === 'string' && time.match(/^\d{1,2}:\d{2}$/) 
    ? time 
    : '12:00';

  // Calculate trip times safely
  const { tripEndTime, waitEndTime, returnEndTime } = calculateTripTimes(
    validDate,
    validTimeString,
    estimatedDuration,
    hasWaitingTime,
    waitingTimeMinutes,
    hasReturnTrip,
    returnDuration
  );

  // Determine the final arrival time based on the trip configuration
  const finalArrivalTime = hasReturnTrip && returnEndTime ? returnEndTime : 
                         (hasWaitingTime && waitEndTime ? waitEndTime : 
                         (tripEndTime || new Date()));

  // Prepare waiting time information if enabled
  const waitingTimeInfo = hasWaitingTime && waitingTimeMinutes > 0 && quoteDetails && tripEndTime ? {
    waitTimeDay: quoteDetails.waitTimeDay || 0,
    waitTimeNight: quoteDetails.waitTimeNight || 0,
    waitPriceDay: quoteDetails.waitPriceDay || 0,
    waitPriceNight: quoteDetails.waitPriceNight || 0,
    totalWaitTime: waitingTimeMinutes,
    waitStartTime: tripEndTime,
    waitEndTime: waitEndTime || tripEndTime
  } : undefined;

  // Prepare night rate information
  const nightRateInfo = {
    isApplied: !!quoteDetails?.isNightRate,
    percentage: quoteDetails?.nightRatePercentage || 0,
    nightHours: quoteDetails?.nightHours || 0,
    totalHours: (estimatedDuration / 60),
    nightStart: quoteDetails?.nightStartDisplay || '',
    nightEnd: quoteDetails?.nightEndDisplay || '',
    nightSurcharge: quoteDetails?.nightSurcharge,
    dayKm: quoteDetails?.dayKm,
    nightKm: quoteDetails?.nightKm,
    totalKm: quoteDetails?.totalKm,
    dayPrice: quoteDetails?.dayPrice,
    nightPrice: quoteDetails?.nightPrice,
    dayPercentage: quoteDetails?.dayPercentage,
    nightPercentage: quoteDetails?.nightPercentage
  };

  // Prepare return night rate information if return trip is enabled
  const returnNightRateInfo = hasReturnTrip ? {
    isApplied: !!quoteDetails?.isReturnNightRate,
    percentage: quoteDetails?.returnNightPercentage || 0,
    nightHours: quoteDetails?.returnNightHours || 0,
    totalHours: (returnDuration / 60),
    nightStart: quoteDetails?.nightStartDisplay || '',
    nightEnd: quoteDetails?.nightEndDisplay || '',
    nightSurcharge: quoteDetails?.returnNightSurcharge,
    dayKm: quoteDetails?.returnDayKm,
    nightKm: quoteDetails?.returnNightKm,
    totalKm: quoteDetails?.returnTotalKm,
    dayPrice: quoteDetails?.returnDayPrice,
    nightPrice: quoteDetails?.returnNightPrice,
    dayPercentage: quoteDetails?.returnDayPercentage,
    nightPercentage: quoteDetails?.returnNightPercentage
  } : undefined;

  // Format the final time display safely
  const formattedFinalTimeDisplay = finalArrivalTime instanceof Date && !isNaN(finalArrivalTime.getTime())
    ? finalArrivalTime.getHours().toString().padStart(2, '0') + ':' + 
      finalArrivalTime.getMinutes().toString().padStart(2, '0')
    : '--:--';

  return (
    <TripTimeInfo
      startTime={validTimeString}
      endTime={formattedFinalTimeDisplay}
      finalTimeDisplay={formattedFinalTimeDisplay}
      nightRateInfo={nightRateInfo}
      returnNightRateInfo={returnNightRateInfo}
      hasReturnTrip={hasReturnTrip}
      waitingTimeInfo={waitingTimeInfo}
      tripEndTime={tripEndTime}
      returnStartTime={waitEndTime}
      returnEndTime={returnEndTime}
      finalArrivalTime={finalArrivalTime}
      sundayRateInfo={quoteDetails?.isSunday ? {
        isApplied: true,
        percentage: quoteDetails?.sundayRate || 0
      } : undefined}
    />
  );
};
