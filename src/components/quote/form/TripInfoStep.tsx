
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddressFormSection from './AddressFormSection';
import QuoteFormOptions from './QuoteFormOptions';
import { RouteDetailsSection } from './steps/RouteDetailsSection';
import { TripDetailsDisplay } from './steps/TripDetailsDisplay';
import { Address } from '@/hooks/useMapbox';
import { Vehicle, WaitingTimeOption } from '@/types/quoteForm';

interface TripInfoStepProps {
  departureAddress: string;
  setDepartureAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date: Date;
  setDate: (date: Date) => void;
  time: string;
  setTime: (time: string) => void;
  selectedVehicle: string;
  setSelectedVehicle: (vehicle: string) => void;
  passengers: string;
  setPassengers: (passengers: string) => void;
  estimatedDistance: number;
  estimatedDuration: number;
  hasReturnTrip: boolean;
  setHasReturnTrip: (value: boolean) => void;
  hasWaitingTime: boolean;
  setHasWaitingTime: (value: boolean) => void;
  waitingTimeMinutes: number;
  setWaitingTimeMinutes: (minutes: number) => void;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  setReturnToSameAddress: (value: boolean) => void;
  customReturnAddress: string;
  setCustomReturnAddress: (address: string) => void;
  waitingTimeOptions: WaitingTimeOption[];
  vehicles: Vehicle[];
  handleDepartureSelect: (address: Address) => void;
  handleDestinationSelect: (address: Address) => void;
  handleReturnAddressSelect: (address: Address) => void;
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleReturnRouteCalculated?: (distance: number, duration: number) => void;
  handleNextStep: () => void;
  returnDistance?: number;
  returnDuration?: number;
  customReturnCoordinates?: [number, number];
  totalDistance?: number;
  totalDuration?: number;
}

const TripInfoStep: React.FC<TripInfoStepProps> = ({
  departureAddress,
  setDepartureAddress,
  destinationAddress,
  setDestinationAddress,
  departureCoordinates,
  destinationCoordinates,
  date,
  setDate,
  time,
  setTime,
  selectedVehicle,
  setSelectedVehicle,
  passengers,
  setPassengers,
  estimatedDistance,
  estimatedDuration,
  hasReturnTrip,
  setHasReturnTrip,
  hasWaitingTime,
  setHasWaitingTime,
  waitingTimeMinutes,
  setWaitingTimeMinutes,
  waitingTimePrice,
  returnToSameAddress,
  setReturnToSameAddress,
  customReturnAddress,
  setCustomReturnAddress,
  waitingTimeOptions,
  vehicles,
  handleDepartureSelect,
  handleDestinationSelect,
  handleReturnAddressSelect,
  handleRouteCalculated,
  handleReturnRouteCalculated,
  handleNextStep,
  returnDistance = 0,
  returnDuration = 0,
  customReturnCoordinates,
  totalDistance,
  totalDuration
}) => {
  const canProceed = departureAddress && destinationAddress && departureCoordinates && destinationCoordinates &&
    (!hasReturnTrip || returnToSameAddress || (customReturnAddress && customReturnCoordinates));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <AddressFormSection
            departureAddress={departureAddress}
            setDepartureAddress={setDepartureAddress}
            destinationAddress={destinationAddress}
            setDestinationAddress={setDestinationAddress}
            departureCoordinates={departureCoordinates}
            setDepartureCoordinates={(coords) => {
              if (handleDepartureSelect) {
                handleDepartureSelect({
                  id: '',
                  name: '',
                  fullAddress: departureAddress,
                  coordinates: coords
                });
              }
            }}
            destinationCoordinates={destinationCoordinates}
            setDestinationCoordinates={(coords) => {
              if (handleDestinationSelect) {
                handleDestinationSelect({
                  id: '',
                  name: '',
                  fullAddress: destinationAddress,
                  coordinates: coords
                });
              }
            }}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            passengers={passengers}
            setPassengers={setPassengers}
            estimatedDistance={estimatedDistance}
            estimatedDuration={estimatedDuration}
            onRouteCalculated={handleRouteCalculated}
            vehicles={vehicles}
          />

          <QuoteFormOptions
            hasReturnTrip={hasReturnTrip}
            setHasReturnTrip={setHasReturnTrip}
            hasWaitingTime={hasWaitingTime}
            setHasWaitingTime={setHasWaitingTime}
            waitingTimeMinutes={waitingTimeMinutes}
            setWaitingTimeMinutes={setWaitingTimeMinutes}
            waitingTimePrice={waitingTimePrice}
            waitingTimeOptions={waitingTimeOptions}
            returnToSameAddress={returnToSameAddress}
            setReturnToSameAddress={setReturnToSameAddress}
            customReturnAddress={customReturnAddress}
            setCustomReturnAddress={setCustomReturnAddress}
            handleReturnAddressSelect={handleReturnAddressSelect}
          />

          {departureCoordinates && destinationCoordinates && (
            <>
              <RouteDetailsSection
                departureCoordinates={departureCoordinates}
                destinationCoordinates={destinationCoordinates}
                customReturnCoordinates={customReturnCoordinates}
                handleRouteCalculated={handleRouteCalculated}
                handleReturnRouteCalculated={handleReturnRouteCalculated}
                hasReturnTrip={hasReturnTrip}
                returnToSameAddress={returnToSameAddress}
              />

              {(estimatedDistance > 0 || estimatedDuration > 0) && (
                <TripDetailsDisplay
                  estimatedDistance={estimatedDistance}
                  estimatedDuration={estimatedDuration}
                  time={time}
                  hasMinDistanceWarning={false}
                  minDistance={0}
                  hasReturnTrip={hasReturnTrip}
                  returnToSameAddress={returnToSameAddress}
                  returnDistance={returnDistance}
                  returnDuration={returnDuration}
                  hasWaitingTime={hasWaitingTime}
                  waitingTimeMinutes={waitingTimeMinutes}
                />
              )}
            </>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleNextStep}
              disabled={!canProceed}
              className="w-full sm:w-auto"
            >
              Étape suivante
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripInfoStep;
