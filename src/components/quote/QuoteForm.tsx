
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, CarFrontIcon, DollarSignIcon, CheckIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import RouteMap from '@/components/map/RouteMap';
import { useMapbox, Address } from '@/hooks/useMapbox';

interface QuoteFormProps {
  clientId?: string;
  onSuccess?: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ clientId, onSuccess }) => {
  const { user } = useAuth();
  const { addQuote } = useQuotes();
  const { clients } = useClients();
  const { toast } = useToast();
  
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [showQuote, setShowQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const [selectedClient, setSelectedClient] = useState(clientId || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Valeurs calculées pour le devis
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  // Véhicules disponibles (normalement ces données viendraient d'une API)
  const vehicles = [
    { id: "sedan", name: "Berline", basePrice: 1.8, description: "Mercedes Classe E ou équivalent" },
    { id: "van", name: "Van", basePrice: 2.2, description: "Mercedes Classe V ou équivalent" },
    { id: "luxury", name: "Luxe", basePrice: 2.5, description: "Mercedes Classe S ou équivalent" }
  ];
  
  // Calcul du prix
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  const estimatedPrice = Math.round(estimatedDistance * basePrice);
  
  // Si un client est déjà sélectionné, charger ses informations
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client.id);
        setFirstName(client.first_name);
        setLastName(client.last_name);
        setEmail(client.email);
      }
    }
  }, [clientId, clients]);
  
  // Pré-remplir les champs de l'utilisateur connecté si disponible
  useEffect(() => {
    if (user && !clientId) {
      const fetchUserInfo = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFirstName(data.first_name || '');
            setLastName(data.last_name || '');
            setEmail(data.email || user.email || '');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, [user]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Si les deux adresses ont des coordonnées, on peut déjà calculer l'itinéraire
    if (departureCoordinates && destinationCoordinates) {
      setTimeout(() => {
        setShowQuote(true);
        setIsLoading(false);
      }, 500);
    } else {
      toast({
        title: 'Adresses incomplètes',
        description: 'Veuillez sélectionner des adresses valides pour le départ et la destination',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleSaveQuote = async () => {
    if (!date) {
      toast({
        title: 'Date manquante',
        description: 'Veuillez sélectionner une date pour le trajet',
        variant: 'destructive'
      });
      return;
    }
    
    if (!departureCoordinates || !destinationCoordinates) {
      toast({
        title: 'Adresses incomplètes',
        description: 'Veuillez sélectionner des adresses valides pour le calcul du trajet',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formatter la date et heure
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      // Vérifier si un client existe déjà ou en créer un nouveau
      let finalClientId = selectedClient;
      
      if (!selectedClient && firstName && lastName && email) {
        // Si on n'a pas de client sélectionné mais qu'on a les informations, créer un nouveau client
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          throw new Error("Utilisateur non authentifié");
        }
        
        const { data, error } = await supabase
          .from('clients')
          .insert({
            driver_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            client_type: 'personal'
          })
          .select()
          .single();
        
        if (error) throw error;
        finalClientId = data.id;
      }
      
      if (!finalClientId) {
        throw new Error("Aucun client spécifié pour ce devis");
      }
      
      // Créer un objet quote avec les coordonnées
      const quoteData: Omit<QuoteWithCoordinates, 'id' | 'created_at' | 'updated_at' | 'quote_pdf'> = {
        client_id: finalClientId,
        vehicle_id: null, // Dans un cas réel, ce serait l'ID du véhicule sélectionné
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration, 
        ride_date: dateTime.toISOString(),
        amount: estimatedPrice,
        status: 'pending',
        driver_id: '' // Ce champ sera automatiquement rempli dans la fonction addQuote
      };
      
      // Enregistrer le devis dans la base de données
      await addQuote.mutateAsync(quoteData);
      
      toast({
        title: 'Devis enregistré',
        description: 'Votre devis a été enregistré avec succès',
      });
      
      setIsQuoteSent(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la sélection des adresses
  const handleDepartureSelect = (address: Address) => {
    setDepartureCoordinates(address.coordinates);
  };

  const handleDestinationSelect = (address: Address) => {
    setDestinationCoordinates(address.coordinates);
  };

  // Gérer le calcul d'itinéraire
  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };
  
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

                {/* Prévisualisation de la carte si les deux adresses ont été sélectionnées */}
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
      ) : isQuoteSent ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Devis enregistré avec succès</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Votre devis a bien été enregistré dans notre système et sera accessible depuis votre dashboard.
              </p>
              <Button onClick={() => {
                setShowQuote(false);
                setIsQuoteSent(false);
              }}>
                Créer un nouveau devis
              </Button>
            </div>
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
                    <p className="text-sm text-muted-foreground">{departureAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{destinationAddress}</p>
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
              
              <div className="w-full h-64">
                <RouteMap
                  departure={departureCoordinates}
                  destination={destinationCoordinates}
                />
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
              
              {!clientId && (
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Vos coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="w-full"
                  onClick={handleSaveQuote}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement en cours...
                    </>
                  ) : (
                    <>
                      <DollarSignIcon className="mr-2 h-4 w-4" />
                      Enregistrer ce devis
                    </>
                  )}
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
