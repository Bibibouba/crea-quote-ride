
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import RouteMap from '@/components/map/RouteMap';
import { Address } from '@/hooks/useMapbox';
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
  return (
    <div className="space-y-6">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Type de véhicule</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle} required>
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Sélectionnez un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex flex-col">
                      <span>{vehicle.name} - {vehicle.model}</span>
                      <span className="text-xs text-muted-foreground">
                        Capacité: {vehicle.capacity} passagers
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

        {/* Options d'aller-retour et temps d'attente */}
        <div className="space-y-4 border rounded-md p-4 bg-secondary/20">
          <h3 className="font-medium mb-2">Options supplémentaires</h3>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="return-trip" className="font-medium">Aller-retour</Label>
              <p className="text-sm text-muted-foreground">Souhaitez-vous prévoir un trajet retour ?</p>
            </div>
            <Switch 
              id="return-trip" 
              checked={hasReturnTrip} 
              onCheckedChange={setHasReturnTrip} 
            />
          </div>
          
          {hasReturnTrip && (
            <>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="waiting-time" className="font-medium">Temps d'attente</Label>
                  <p className="text-sm text-muted-foreground">Le chauffeur doit-il vous attendre (rendez-vous médical, etc) ?</p>
                </div>
                <Switch 
                  id="waiting-time" 
                  checked={hasWaitingTime} 
                  onCheckedChange={setHasWaitingTime}
                />
              </div>
              
              {hasWaitingTime && (
                <div className="pt-2">
                  <Label htmlFor="waiting-duration" className="font-medium">Durée d'attente estimée</Label>
                  <Select
                    value={waitingTimeMinutes.toString()}
                    onValueChange={(value) => setWaitingTimeMinutes(parseInt(value))}
                  >
                    <SelectTrigger id="waiting-duration" className="mt-1.5">
                      <SelectValue placeholder="Sélectionnez une durée" />
                    </SelectTrigger>
                    <SelectContent>
                      {waitingTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {waitingTimePrice > 0 && (
                    <p className="text-sm mt-2">
                      Prix du temps d'attente: <span className="font-medium">{waitingTimePrice}€</span>
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between space-x-2 pt-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="same-address" className="font-medium">Retour à la même adresse</Label>
                  <p className="text-sm text-muted-foreground">Souhaitez-vous être redéposé à la même adresse qu'à l'aller ?</p>
                </div>
                <Switch 
                  id="same-address" 
                  checked={returnToSameAddress} 
                  onCheckedChange={setReturnToSameAddress}
                />
              </div>
              
              {!returnToSameAddress && (
                <div className="pt-2">
                  <AddressAutocomplete
                    label="Adresse de retour"
                    placeholder="Saisissez l'adresse de retour"
                    value={customReturnAddress}
                    onChange={setCustomReturnAddress}
                    onSelect={handleReturnAddressSelect}
                    required
                  />
                </div>
              )}
            </>
          )}
        </div>

        {departureCoordinates && destinationCoordinates && (
          <div className="mt-4">
            <Label className="mb-2 block">Aperçu du trajet</Label>
            <RouteMap
              departure={departureCoordinates}
              destination={destinationCoordinates}
              onRouteCalculated={handleRouteCalculated}
            />
            {estimatedDistance > 0 && estimatedDuration > 0 && (
              <div className="flex justify-between mt-2 text-sm">
                <p className="text-muted-foreground">Distance estimée: <span className="font-medium">{estimatedDistance} km</span></p>
                <p className="text-muted-foreground">Durée estimée: <span className="font-medium">{estimatedDuration} min</span></p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleNextStep}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default TripInfoStep;
