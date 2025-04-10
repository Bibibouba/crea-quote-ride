
import React from 'react';
import { Button } from '@/components/ui/button';
import AddressFormSection from '@/components/address/AddressFormSection';
import { Address } from '@/hooks/useMapbox';
import ReturnTripOptions from './ReturnTripOptions';
import { useFormValidation } from './useFormValidation';
import { WaitingTimeOption } from '@/hooks/useQuoteForm';

interface TripInfoStepProps {
  departureAddress: string;
  setDepartureAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date?: Date;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  selectedVehicle: string;
  setSelectedVehicle: (vehicleId: string) => void;
  passengers: string;
  setPassengers: (passengers: string) => void;
  estimatedDistance: number;
  estimatedDuration: number;
  hasReturnTrip: boolean;
  setHasReturnTrip: (hasReturn: boolean) => void;
  hasWaitingTime: boolean;
  setHasWaitingTime: (hasWaiting: boolean) => void;
  waitingTimeMinutes: number;
  setWaitingTimeMinutes: (minutes: number) => void;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  setReturnToSameAddress: (returnToSame: boolean) => void;
  customReturnAddress: string;
  setCustomReturnAddress: (address: string) => void;
  waitingTimeOptions: WaitingTimeOption[];
  vehicles: any[];
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
  const { errors, validateTripForm, focusFirstError } = useFormValidation();
  
  const onNext = () => {
    console.log("Validating form with values:", {
      departureAddress,
      destinationAddress,
      date,
      time,
      selectedVehicle,
      departureCoordinates,
      destinationCoordinates
    });
    
    if (validateTripForm(
      departureAddress,
      destinationAddress,
      date,
      time,
      selectedVehicle,
      departureCoordinates,
      destinationCoordinates
    )) {
      console.log("Form validation successful, proceeding to next step");
      handleNextStep();
    } else {
      focusFirstError();
      console.log("Form validation failed, errors:", errors);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 space-y-6 bg-gradient-to-r from-pastelBlue/30 to-transparent">
        <h3 className="font-medium text-primary">Informations du trajet</h3>
        
        <AddressFormSection
          departureAddress={departureAddress}
          setDepartureAddress={setDepartureAddress}
          destinationAddress={destinationAddress}
          setDestinationAddress={setDestinationAddress}
          departureCoordinates={departureCoordinates}
          destinationCoordinates={destinationCoordinates}
          setDepartureCoordinates={(address) => handleDepartureSelect(address as unknown as Address)}
          setDestinationCoordinates={(address) => handleDestinationSelect(address as unknown as Address)}
          date={date || new Date()}
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
          errors={errors}
        />
        
        {/* Options supplémentaires */}
        <ReturnTripOptions
          hasReturnTrip={hasReturnTrip}
          setHasReturnTrip={setHasReturnTrip}
          hasWaitingTime={hasWaitingTime}
          setHasWaitingTime={setHasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          setWaitingTimeMinutes={setWaitingTimeMinutes}
          waitingTimePrice={waitingTimePrice}
          returnToSameAddress={returnToSameAddress}
          setReturnToSameAddress={setReturnToSameAddress}
          customReturnAddress={customReturnAddress}
          setCustomReturnAddress={setCustomReturnAddress}
          waitingTimeOptions={waitingTimeOptions}
          handleReturnAddressSelect={handleReturnAddressSelect}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          Étape suivante
        </Button>
      </div>
    </div>
  );
};

export default TripInfoStep;
