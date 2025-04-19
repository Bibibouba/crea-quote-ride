
import React from 'react';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import RouteMap from '@/components/map/RouteMap';
import { Address } from '@/hooks/useMapbox';
import { formatDuration } from '@/lib/formatDuration';

interface AddressFormSectionProps {
  departureAddress: string;
  setDepartureAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  departureCoordinates: [number, number] | undefined;
  setDepartureCoordinates: (coords: [number, number]) => void;
  destinationCoordinates: [number, number] | undefined;
  setDestinationCoordinates: (coords: [number, number]) => void;
  date: Date;
  setDate: (date: Date | undefined) => void;
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
  vehicles: Array<{ id: string; name: string; basePrice: number; description: string }>;
  hasReturnTrip?: boolean;
  returnToSameAddress?: boolean;
  customReturnAddress?: string;
  customReturnCoordinates?: [number, number];
}

const AddressFormSection: React.FC<AddressFormSectionProps> = ({
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
  hasReturnTrip = false,
  returnToSameAddress = true,
  customReturnAddress = '',
  customReturnCoordinates
}) => {

  // Handler for selecting departure address
  const handleDepartureSelect = (address: Address) => {
    setDepartureAddress(address.fullAddress);
    setDepartureCoordinates(address.coordinates);
  };

  // Handler for selecting destination address
  const handleDestinationSelect = (address: Address) => {
    setDestinationAddress(address.fullAddress);
    setDestinationCoordinates(address.coordinates);
  };

  // Show return information if needed
  const showReturnInfo = hasReturnTrip && !returnToSameAddress && customReturnCoordinates;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <AddressAutocomplete
          label="Adresse de départ"
          placeholder="Saisissez l'adresse de départ"
          value={departureAddress}
          onChange={setDepartureAddress}
          onAddressSelect={handleDepartureSelect}
        />

        <AddressAutocomplete
          label="Adresse de destination"
          placeholder="Saisissez l'adresse de destination"
          value={destinationAddress}
          onChange={setDestinationAddress}
          onAddressSelect={handleDestinationSelect}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date du trajet</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Heure de départ</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Type de véhicule</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.basePrice.toFixed(2)}€/km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers">Nombre de passagers</Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger>
                <SelectValue placeholder="Nombre de passagers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'passager' : 'passagers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {departureCoordinates && destinationCoordinates && (
          <div className="mt-6 space-y-2">
            <Label>Aperçu de l'itinéraire</Label>
            <RouteMap
              departure={departureCoordinates}
              destination={destinationCoordinates}
              onRouteCalculated={onRouteCalculated}
              returnDestination={showReturnInfo ? customReturnCoordinates : undefined}
              onReturnRouteCalculated={onReturnRouteCalculated}
              showReturn={hasReturnTrip && !returnToSameAddress}
            />
            
            <div className="flex justify-between items-center pt-2 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold">Distance aller: </span>
                {estimatedDistance ? `${estimatedDistance} km` : '-'}
              </div>
              <div>
                <span className="font-semibold">Durée aller: </span>
                {estimatedDuration ? formatDuration(estimatedDuration) : '-'}
              </div>
            </div>
            
            {hasReturnTrip && customReturnAddress && !returnToSameAddress && (
              <div className="flex justify-between items-center pt-1 text-sm text-muted-foreground">
                <div>
                  <span className="font-semibold">Distance retour: </span>
                  <span className="text-emerald-600">{customReturnCoordinates ? `${returnToSameAddress ? estimatedDistance : customReturnCoordinates ? estimatedDistance : 0} km` : '-'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressFormSection;
