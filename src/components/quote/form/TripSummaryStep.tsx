import React, { useEffect } from 'react';
import { TripTimeInfo } from './summary/TripTimeInfo';
import { RouteDetailsSection } from './steps/RouteDetailsSection';
import { TripPricingSection } from './steps/TripPricingSection';
import { TripHeaderCard } from './steps/TripHeaderCard';
import { TripSummaryHeader } from './summary/trip-summary/TripSummaryHeader';
import { TripSummaryActions } from './summary/trip-summary/TripSummaryActions';

interface TripSummaryStepProps {
  departureAddress: string;
  destinationAddress: string;
  customReturnAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date?: Date;
  time: string;
  selectedVehicle: string;
  passengers: string;
  estimatedDistance: number;
  estimatedDuration: number;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  returnToSameAddress: boolean;
  returnDistance: number;
  returnDuration: number;
  customReturnCoordinates?: [number, number];
  quoteDetails: any;
  vehicles: any[];
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleReturnRouteCalculated?: (distance: number, duration: number) => void;
}

const TripSummaryStep: React.FC<TripSummaryStepProps> = (props) => {
  const {
    departureAddress,
    destinationAddress,
    customReturnAddress,
    departureCoordinates,
    destinationCoordinates,
    date,
    time,
    selectedVehicle,
    passengers,
    estimatedDistance,
    estimatedDuration,
    hasReturnTrip,
    hasWaitingTime,
    waitingTimeMinutes,
    returnToSameAddress,
    returnDistance,
    returnDuration,
    customReturnCoordinates,
    quoteDetails,
    vehicles,
    handleRouteCalculated,
    handleNextStep,
    handlePreviousStep,
    handleReturnRouteCalculated
  } = props;
  
  const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
  const isNightRate = quoteDetails?.isNightRate;
  const isSunday = quoteDetails?.isSunday;
  const hasMinDistanceWarning = quoteDetails?.hasMinDistanceWarning;
  const minDistance = quoteDetails?.minDistance || 0;

  useEffect(() => {
    console.log('TripSummaryStep rendered with quoteDetails:', quoteDetails);
    
    if (typeof window !== 'undefined') {
      (window as any).quoteDetails = quoteDetails;
      (window as any).waitingTimeInfo = hasWaitingTime && waitingTimeMinutes > 0 ? {
        waitTimeDay: quoteDetails?.waitTimeDay || 0,
        waitTimeNight: quoteDetails?.waitTimeNight || 0,
        totalWaitTime: waitingTimeMinutes,
        waitEndTime: quoteDetails?.waitEndTime
      } : null;
    }
  }, [quoteDetails, hasWaitingTime, waitingTimeMinutes]);

  const tripEndTime = (() => {
    if (!date) return new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const arrivalTime = new Date(date);
    arrivalTime.setHours(hours);
    arrivalTime.setMinutes(minutes + estimatedDuration);
    return arrivalTime;
  })();

  const waitEndTime = hasWaitingTime ? 
    (quoteDetails?.waitEndTime ? 
      new Date(quoteDetails.waitEndTime) : 
      new Date(tripEndTime.getTime() + waitingTimeMinutes * 60 * 1000)) 
    : tripEndTime;

  let correctedWaitEndTime = waitEndTime;
  if (hasWaitingTime && waitingTimeMinutes > 0) {
    correctedWaitEndTime = new Date(tripEndTime.getTime() + waitingTimeMinutes * 60 * 1000);
    console.log('Corrected wait end time:', {
      originalWaitEndTime: waitEndTime.toLocaleTimeString(),
      correctedWaitEndTime: correctedWaitEndTime.toLocaleTimeString(),
      waitingTimeMinutes,
      tripEndTime: tripEndTime.toLocaleTimeString()
    });
  }

  const returnEndTime = hasReturnTrip ? 
    new Date(correctedWaitEndTime.getTime() + returnDuration * 60 * 1000) 
    : undefined;

  const nightRateInfo = {
    isApplied: !!isNightRate,
    percentage: quoteDetails?.nightRatePercentage || 0,
    nightHours: quoteDetails?.nightHours || 0,
    totalHours: (estimatedDuration / 60),
    nightStart: quoteDetails?.nightStartDisplay || '',
    nightEnd: quoteDetails?.nightEndDisplay || '',
    nightSurcharge: quoteDetails?.nightSurcharge,
    dayKm: quoteDetails?.dayKm,
    nightKm: quoteDetails?.nightKm,
    totalKm: quoteDetails?.totalKm || estimatedDistance,
    dayPrice: quoteDetails?.dayPrice,
    nightPrice: quoteDetails?.nightPrice,
    dayPercentage: quoteDetails?.dayPercentage,
    nightPercentage: quoteDetails?.nightPercentage
  };
  
  const returnNightRateInfo = hasReturnTrip ? {
    isApplied: !!quoteDetails?.isReturnNightRate,
    percentage: quoteDetails?.returnNightRatePercentage || 0,
    nightHours: quoteDetails?.returnNightHours || 0,
    totalHours: (returnDuration / 60),
    nightStart: quoteDetails?.nightStartDisplay || '',
    nightEnd: quoteDetails?.nightEndDisplay || '',
    nightSurcharge: quoteDetails?.returnNightSurcharge,
    dayKm: quoteDetails?.returnDayKm,
    nightKm: quoteDetails?.returnNightKm,
    totalKm: quoteDetails?.returnTotalKm || returnDistance,
    dayPrice: quoteDetails?.returnDayPrice,
    nightPrice: quoteDetails?.returnNightPrice,
    dayPercentage: quoteDetails?.returnDayPercentage,
    nightPercentage: quoteDetails?.returnNightPercentage
  } : undefined;

  const sundayRateInfo = isSunday ? {
    isApplied: true,
    percentage: selectedVehicleInfo?.holiday_sunday_percentage || 0
  } : undefined;

  const waitingTimeInfo = hasWaitingTime && waitingTimeMinutes > 0 && quoteDetails ? {
    waitTimeDay: quoteDetails.waitTimeDay || 0,
    waitTimeNight: quoteDetails.waitTimeNight || 0,
    waitPriceDay: quoteDetails.waitPriceDay || 0,
    waitPriceNight: quoteDetails.waitPriceNight || 0,
    totalWaitTime: waitingTimeMinutes,
    waitStartTime: tripEndTime,
    waitEndTime: correctedWaitEndTime
  } : undefined;

  console.log("Calculated trip times:", {
    tripStartTime: time,
    tripEndTime: tripEndTime?.toLocaleTimeString(),
    waitStartTime: tripEndTime?.toLocaleTimeString(),
    waitEndTime: correctedWaitEndTime?.toLocaleTimeString(),
    returnStartTime: correctedWaitEndTime?.toLocaleTimeString(),
    returnEndTime: returnEndTime?.toLocaleTimeString(),
    waitingTimeMinutes,
    returnDuration
  });

  return (
    <div className="space-y-6">
      <TripHeaderCard
        departureAddress={departureAddress}
        destinationAddress={destinationAddress}
        customReturnAddress={customReturnAddress}
        hasReturnTrip={hasReturnTrip}
        returnToSameAddress={returnToSameAddress}
        date={date}
        time={time}
        selectedVehicleInfo={selectedVehicleInfo}
        passengers={passengers}
        hasWaitingTime={hasWaitingTime}
        waitingTimeMinutes={waitingTimeMinutes}
      />
      
      <TripSummaryHeader
        hasMinDistanceWarning={hasMinDistanceWarning}
        estimatedDistance={estimatedDistance}
        minDistance={minDistance}
      />
      
      <TripTimeInfo
        startTime={time}
        endTime={tripEndTime.getHours().toString().padStart(2, '0') + ':' + 
                tripEndTime.getMinutes().toString().padStart(2, '0')}
        nightRateInfo={nightRateInfo}
        returnNightRateInfo={returnNightRateInfo}
        sundayRateInfo={sundayRateInfo}
        hasReturnTrip={hasReturnTrip}
        waitingTimeInfo={waitingTimeInfo}
        tripEndTime={tripEndTime}
        returnStartTime={correctedWaitEndTime}
        returnEndTime={returnEndTime}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouteDetailsSection
          departureCoordinates={departureCoordinates}
          destinationCoordinates={destinationCoordinates}
          customReturnCoordinates={customReturnCoordinates}
          handleRouteCalculated={handleRouteCalculated}
          handleReturnRouteCalculated={handleReturnRouteCalculated}
          hasReturnTrip={hasReturnTrip}
          returnToSameAddress={returnToSameAddress}
        />
        
        <TripPricingSection
          estimatedDistance={estimatedDistance}
          estimatedDuration={estimatedDuration}
          time={time}
          hasMinDistanceWarning={hasMinDistanceWarning}
          minDistance={minDistance}
          hasReturnTrip={hasReturnTrip}
          returnToSameAddress={returnToSameAddress}
          returnDistance={returnDistance}
          returnDuration={returnDuration}
          hasWaitingTime={hasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          quoteDetails={quoteDetails}
          isNightRate={isNightRate}
          isSunday={isSunday}
          nightHours={nightRateInfo.nightHours}
        />
      </div>
      
      <TripSummaryActions
        handlePreviousStep={handlePreviousStep}
        handleNextStep={handleNextStep}
      />
    </div>
  );
};

export default TripSummaryStep;
