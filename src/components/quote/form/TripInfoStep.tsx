
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddressFormSection from './AddressFormSection';
import QuoteFormOptions from './QuoteFormOptions';
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
  handleNextStep: () => void;
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
  handleNextStep
}) => {
  // Vérifier si les deux adresses sont renseignées et si les coordonnées sont disponibles
  const canProceed = departureAddress && destinationAddress && departureCoordinates && destinationCoordinates;

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
