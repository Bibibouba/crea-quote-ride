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
  const { tripEndTime, waitEndTime, returnEndTime } = calculateTripTimes(
    date,
    time,
    estimatedDuration,
    hasWaitingTime,
    waitingTimeMinutes,
    hasReturnTrip,
    returnDuration
  );

  const waitingTimeInfo = hasWaitingTime && waitingTimeMinutes > 0 && quoteDetails ? {
    waitTimeDay: quoteDetails.waitTimeDay || 0,
    waitTimeNight: quoteDetails.waitTimeNight || 0,
    waitPriceDay: quoteDetails.waitPriceDay || 0,
    waitPriceNight: quoteDetails.waitPriceNight || 0,
    totalWaitTime: waitingTimeMinutes,
    waitStartTime: tripEndTime,
    waitEndTime: waitEndTime
  } : undefined;

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

  return (
    <TripTimeInfo
      startTime={time}
      endTime={tripEndTime.getHours().toString().padStart(2, '0') + ':' + 
              tripEndTime.getMinutes().toString().padStart(2, '0')}
      nightRateInfo={nightRateInfo}
      returnNightRateInfo={returnNightRateInfo}
      hasReturnTrip={hasReturnTrip}
      waitingTimeInfo={waitingTimeInfo}
      tripEndTime={tripEndTime}
      returnStartTime={waitEndTime}
      returnEndTime={returnEndTime}
      sundayRateInfo={quoteDetails?.isSunday ? {
        isApplied: true,
        percentage: quoteDetails?.sundayRate || 0
      } : undefined}
    />
  );
};
