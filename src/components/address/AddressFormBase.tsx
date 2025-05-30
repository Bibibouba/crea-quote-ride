
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
  vehicles: Array<{ id: string; name: string; basePrice: number; description: string }>;
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
  vehicles
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <AddressAutocomplete
          label="Adresse de départ"
          placeholder="Saisissez l'adresse de départ"
          value={departureAddress}
          onChange={setDepartureAddress}
          onSelect={handleDepartureSelect}
          required
        />
        <AddressAutocomplete
          label="Adresse de destination"
          placeholder="Saisissez l'adresse de destination"
          value={destinationAddress}
          onChange={setDestinationAddress}
          onSelect={handleDestinationSelect}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
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
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionnez une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={fr}
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Heure</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vehicle">Type de véhicule</Label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle} required>
            <SelectTrigger id="vehicle" className="w-full">
              <SelectValue placeholder="Sélectionnez un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      {vehicle.name}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {vehicle.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="passengers">Nombre de passagers</Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger id="passengers">
              <SelectValue placeholder="Nombre de passagers" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'passager' : 'passagers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Prévisualisation de la carte si les deux adresses ont été sélectionnées */}
      {departureCoordinates && destinationCoordinates && (
        <div className="mt-4">
          <Label className="mb-2 block">Aperçu du trajet</Label>
          <div className="h-[300px] sm:h-[400px] border rounded-lg overflow-hidden">
            <RouteMap
              departure={departureCoordinates}
              destination={destinationCoordinates}
              onRouteCalculated={onRouteCalculated}
            />
          </div>
          {estimatedDistance > 0 && estimatedDuration > 0 && (
            <div className="flex flex-col xs:flex-row justify-between mt-2 text-sm">
              <p className="text-muted-foreground">Distance estimée: <span className="font-medium">{estimatedDistance} km</span></p>
              <p className="text-muted-foreground">Durée estimée: <span className="font-medium">{formatDuration(estimatedDuration)}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressFormSection;
