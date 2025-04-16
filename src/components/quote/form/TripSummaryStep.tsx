
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { TripTimeInfo } from './summary/TripTimeInfo';
import { RouteDetailsSection } from './steps/RouteDetailsSection';
import { TripPricingSection } from './steps/TripPricingSection';
import { TripHeaderCard } from './steps/TripHeaderCard';

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
  const nightHours = quoteDetails?.nightHours || 0;
  const nightRatePercentage = quoteDetails?.nightRatePercentage || 0;
  const nightStartDisplay = quoteDetails?.nightStartDisplay || '';
  const nightEndDisplay = quoteDetails?.nightEndDisplay || '';
  const dayKm = quoteDetails?.dayKm;
  const nightKm = quoteDetails?.nightKm;
  const totalKm = quoteDetails?.totalKm || estimatedDistance;
  
  // Infos retour
  const returnDayKm = quoteDetails?.returnDayKm;
  const returnNightKm = quoteDetails?.returnNightKm;
  const returnTotalKm = quoteDetails?.returnTotalKm || returnDistance;
  const returnNightHours = quoteDetails?.returnNightHours || 0;
  const returnDayPercentage = quoteDetails?.returnDayPercentage;
  const returnNightPercentage = quoteDetails?.returnNightPercentage;
  const returnDayPrice = quoteDetails?.returnDayPrice;
  const returnNightPrice = quoteDetails?.returnNightPrice;
  const returnNightSurcharge = quoteDetails?.returnNightSurcharge;

  const nightRateInfo = {
    isApplied: !!isNightRate,
    percentage: nightRatePercentage,
    nightHours: nightHours,
    totalHours: (estimatedDuration / 60),
    nightStart: nightStartDisplay,
    nightEnd: nightEndDisplay,
    nightSurcharge: quoteDetails?.nightSurcharge,
    dayKm: dayKm,
    nightKm: nightKm,
    totalKm: totalKm,
    dayPrice: quoteDetails?.dayPrice,
    nightPrice: quoteDetails?.nightPrice,
    dayPercentage: quoteDetails?.dayPercentage,
    nightPercentage: quoteDetails?.nightPercentage
  };
  
  // Informations sur le trajet de retour
  const returnNightRateInfo = hasReturnTrip ? {
    isApplied: !!quoteDetails?.isReturnNightRate,
    percentage: nightRatePercentage,
    nightHours: returnNightHours,
    totalHours: (returnDuration / 60),
    nightStart: nightStartDisplay,
    nightEnd: nightEndDisplay,
    nightSurcharge: returnNightSurcharge,
    dayKm: returnDayKm,
    nightKm: returnNightKm,
    totalKm: returnTotalKm,
    dayPrice: returnDayPrice,
    nightPrice: returnNightPrice,
    dayPercentage: returnDayPercentage,
    nightPercentage: returnNightPercentage
  } : undefined;

  const sundayRateInfo = isSunday ? {
    isApplied: true,
    percentage: selectedVehicleInfo?.holiday_sunday_percentage || 0
  } : undefined;

  // Calculate trip end time
  const tripEndTime = (() => {
    const [hours, minutes] = time.split(':').map(Number);
    const arrivalTime = new Date();
    arrivalTime.setHours(hours);
    arrivalTime.setMinutes(minutes + estimatedDuration);
    return arrivalTime;
  })();

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
      
      {hasMinDistanceWarning && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Distance minimale</AlertTitle>
          <AlertDescription className="text-amber-700">
            La distance de ce trajet ({estimatedDistance} km) est inférieure à la distance minimale facturée pour ce véhicule ({minDistance} km).
            Un supplément sera appliqué pour atteindre la distance minimale.
          </AlertDescription>
        </Alert>
      )}
      
      <TripTimeInfo
        startTime={time}
        endTime={tripEndTime.getHours().toString().padStart(2, '0') + ':' + 
                tripEndTime.getMinutes().toString().padStart(2, '0')}
        nightRateInfo={nightRateInfo}
        returnNightRateInfo={returnNightRateInfo}
        sundayRateInfo={sundayRateInfo}
        hasReturnTrip={hasReturnTrip}
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
          nightHours={nightHours}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto order-1 sm:order-none">
          Retour
        </Button>
        <Button onClick={handleNextStep} className="w-full sm:w-auto order-0 sm:order-none">
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default TripSummaryStep;
