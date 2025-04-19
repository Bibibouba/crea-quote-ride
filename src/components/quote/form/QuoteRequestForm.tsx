
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AddressFormSection from '@/components/quote/form/AddressFormSection';
import QuoteFormOptions from './QuoteFormOptions';
import { Address } from '@/hooks/useMapbox';
import { Vehicle } from '@/types/quoteForm';

interface QuoteRequestFormProps {
  departureAddress: string;
  setDepartureAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  departureCoordinates?: [number, number];
  setDepartureCoordinates: (coordinates?: [number, number]) => void;
  destinationCoordinates?: [number, number];
  setDestinationCoordinates: (coordinates?: [number, number]) => void;
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
  onRouteCalculated: (distance: number, duration: number) => void;
  onReturnRouteCalculated?: (distance: number, duration: number) => void;
  vehicles: Vehicle[];
  hasReturnTrip: boolean;
  setHasReturnTrip: (hasReturn: boolean) => void;
  hasWaitingTime: boolean;
  setHasWaitingTime: (hasWaiting: boolean) => void;
  waitingTimeMinutes: number;
  setWaitingTimeMinutes: (minutes: number) => void;
  waitingTimePrice: number;
  waitingTimeOptions: { value: number; label: string }[];
  returnToSameAddress: boolean;
  setReturnToSameAddress: (sameAddress: boolean) => void;
  customReturnAddress: string;
  setCustomReturnAddress: (address: string) => void;
  handleReturnAddressSelect: (address: Address) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  returnDistance: number;
  returnDuration: number;
  customReturnCoordinates?: [number, number];
  // Remove totalDistance property
  totalDuration: number;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({
  departureAddress,
  setDepartureAddress,
  destinationAddress,
  setDestinationAddress,
  departureCoordinates,
  setDepartureCoordinates,
  destinationCoordinates,
  setDestinationCoordinates,
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
  onRouteCalculated,
  onReturnRouteCalculated,
  vehicles,
  hasReturnTrip,
  setHasReturnTrip,
  hasWaitingTime,
  setHasWaitingTime,
  waitingTimeMinutes,
  setWaitingTimeMinutes,
  waitingTimePrice,
  waitingTimeOptions,
  returnToSameAddress,
  setReturnToSameAddress,
  customReturnAddress,
  setCustomReturnAddress,
  handleReturnAddressSelect,
  isLoading,
  handleSubmit,
  returnDistance,
  returnDuration,
  customReturnCoordinates
}) => {
  return (
    <Card>
      <CardHeader className="space-y-1 sm:space-y-2">
        <CardTitle className="text-xl sm:text-2xl">Simulateur de devis VTC</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Obtenez un devis instantané pour votre trajet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            <AddressFormSection 
              departureAddress={departureAddress}
              setDepartureAddress={setDepartureAddress}
              destinationAddress={destinationAddress}
              setDestinationAddress={setDestinationAddress}
              departureCoordinates={departureCoordinates}
              setDepartureCoordinates={setDepartureCoordinates}
              destinationCoordinates={destinationCoordinates}
              setDestinationCoordinates={setDestinationCoordinates}
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
              onRouteCalculated={onRouteCalculated}
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
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calcul en cours...
              </>
            ) : "Obtenir un devis"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteRequestForm;
