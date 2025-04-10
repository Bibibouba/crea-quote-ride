
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import { Address } from '@/hooks/useMapbox';
import { WaitingTimeOption } from '@/hooks/useQuoteForm';
import AddressFormSection from '@/components/address/AddressFormSection';

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
  const [errors, setErrors] = useState({
    departureAddress: false,
    destinationAddress: false,
    date: false,
    time: false,
    vehicle: false,
  });
  
  const validateForm = (): boolean => {
    const newErrors = {
      departureAddress: !departureAddress.trim(),
      destinationAddress: !destinationAddress.trim(),
      date: !date,
      time: !time.trim(),
      vehicle: !selectedVehicle,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
  
  const onNext = () => {
    if (validateForm()) {
      handleNextStep();
    } else {
      const firstError = Object.entries(errors).find(([_, value]) => value)?.[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
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
        <div className="space-y-4 bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="return-trip" className="cursor-pointer">Voyage retour</Label>
              <Switch
                id="return-trip"
                checked={hasReturnTrip}
                onCheckedChange={setHasReturnTrip}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="waiting-time" className="cursor-pointer">Temps d'attente</Label>
              <Switch
                id="waiting-time"
                checked={hasWaitingTime}
                onCheckedChange={setHasWaitingTime}
              />
            </div>
          </div>
          
          {/* Sélecteur de temps d'attente */}
          {hasWaitingTime && (
            <div className="p-3 bg-muted/20 rounded-md">
              <Label htmlFor="waiting-time-minutes">Temps d'attente</Label>
              <Select 
                value={waitingTimeMinutes.toString()} 
                onValueChange={(value) => setWaitingTimeMinutes(parseInt(value))}
              >
                <SelectTrigger id="waiting-time-minutes" className="mt-1.5">
                  <SelectValue placeholder="Sélectionnez le temps d'attente" />
                </SelectTrigger>
                <SelectContent>
                  {waitingTimeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label} (+{(option.value / 15) * 7.5} €)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Adresse de retour */}
          {hasReturnTrip && (
            <div className="space-y-3 p-3 bg-muted/20 rounded-md">
              <div className="flex items-center justify-between">
                <Label htmlFor="return-to-same" className="cursor-pointer">
                  Retour à l'adresse de départ
                </Label>
                <Switch
                  id="return-to-same"
                  checked={returnToSameAddress}
                  onCheckedChange={setReturnToSameAddress}
                />
              </div>
              
              {!returnToSameAddress && (
                <AddressAutocomplete
                  label="Adresse de retour personnalisée"
                  placeholder="Saisissez l'adresse de retour"
                  value={customReturnAddress}
                  onChange={setCustomReturnAddress}
                  onSelect={handleReturnAddressSelect}
                />
              )}
            </div>
          )}
        </div>
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
