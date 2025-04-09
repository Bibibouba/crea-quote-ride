
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, MapIcon, CarFrontIcon, NavigationIcon, DollarSignIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const QuoteForm = () => {
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setShowQuote(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const vehicles = [
    { id: "sedan", name: "Berline", basePrice: 1.8, description: "Mercedes Classe E ou équivalent" },
    { id: "van", name: "Van", basePrice: 2.2, description: "Mercedes Classe V ou équivalent" },
    { id: "luxury", name: "Luxe", basePrice: 2.5, description: "Mercedes Classe S ou équivalent" }
  ];
  
  const estimatedDistance = 40; // km
  const estimatedDuration = 45; // minutes
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  const estimatedPrice = Math.round(estimatedDistance * basePrice);
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {!showQuote ? (
        <Card>
          <CardHeader>
            <CardTitle>Simulateur de devis VTC</CardTitle>
            <CardDescription>
              Obtenez un devis instantané pour votre trajet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departure">Adresse de départ</Label>
                    <div className="relative">
                      <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="departure"
                        placeholder="15 Rue de Rivoli, Paris"
                        className="pl-10"
                        value={departureAddress}
                        onChange={(e) => setDepartureAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Adresse de destination</Label>
                    <div className="relative">
                      <NavigationIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="destination"
                        placeholder="Aéroport Charles de Gaulle, Paris"
                        className="pl-10"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
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
                      <SelectTrigger id="vehicle" className="w-full">
                        <SelectValue placeholder="Sélectionnez un véhicule">
                          <div className="flex items-center">
                            {selectedVehicle && (
                              <>
                                <CarFrontIcon className="mr-2 h-4 w-4" />
                                {vehicles.find(v => v.id === selectedVehicle)?.name}
                              </>
                            )}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <CarFrontIcon className="mr-2 h-4 w-4" />
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
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Calcul en cours..." : "Obtenir un devis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Votre devis VTC</CardTitle>
            <CardDescription>
              Estimation pour votre trajet du {date ? format(date, "d MMMM yyyy", { locale: fr }) : ""} à {time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-secondary p-4 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Départ</p>
                    <p className="text-sm text-muted-foreground">{departureAddress || "15 Rue de Rivoli, Paris"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{destinationAddress || "Aéroport Charles de Gaulle, Paris"}</p>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <div>
                    <p className="text-sm font-medium">Distance estimée</p>
                    <p className="text-sm text-muted-foreground">{estimatedDistance} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Durée estimée</p>
                    <p className="text-sm text-muted-foreground">{estimatedDuration} minutes</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="font-medium">Véhicule sélectionné</p>
                  <p>{vehicles.find(v => v.id === selectedVehicle)?.name || "Berline"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Nombre de passagers</p>
                  <p>{passengers} {parseInt(passengers) === 1 ? 'passager' : 'passagers'}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Prix au kilomètre</p>
                  <p>{basePrice.toFixed(2)}€/km</p>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-4">
                  <p className="font-medium">Montant total</p>
                  <p className="text-xl font-bold">{estimatedPrice}€</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="w-full">
                  <DollarSignIcon className="mr-2 h-4 w-4" />
                  Confirmer et payer
                </Button>
                <Button variant="outline" onClick={() => setShowQuote(false)}>
                  Modifier le devis
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                * Ce montant est une estimation et peut varier en fonction des conditions réelles de circulation
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuoteForm;
