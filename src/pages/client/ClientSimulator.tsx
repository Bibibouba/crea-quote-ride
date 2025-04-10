import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckIcon, Send } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { usePricing } from '@/hooks/use-pricing';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import QuoteForm from '@/components/quote/QuoteForm';
import { supabase } from '@/integrations/supabase/client';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import RouteMap from '@/components/map/RouteMap';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';

const ClientSimulator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { addQuote } = useQuotes();
  const { 
    pricingSettings, 
    loading: pricingLoading,
    distanceTiers
  } = usePricing();
  
  const [activeTab, setActiveTab] = useState('step1');
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureCoordinates, setDepartureCoordinates] = useState<[number, number] | undefined>(undefined);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedDistance, setEstimatedDistance] = useState(40); // km
  const [estimatedDuration, setEstimatedDuration] = useState(45); // minutes
  const [price, setPrice] = useState(0);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  
  useEffect(() => {
    if (user) {
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
  
  useEffect(() => {
    if (!selectedVehicle || !pricingSettings || !distanceTiers) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    const vehicleTypeId = vehicle.vehicle_type_id;
    
    let pricePerKm = pricingSettings.price_per_km;
    
    if (distanceTiers && distanceTiers.length > 0) {
      const applicableTiers = distanceTiers.filter(tier => 
        !tier.vehicle_id || tier.vehicle_id === vehicleTypeId
      );
      
      const applicableTier = applicableTiers.find(tier => 
        estimatedDistance >= tier.min_km && 
        (!tier.max_km || estimatedDistance <= tier.max_km)
      );
      
      if (applicableTier) {
        pricePerKm = applicableTier.price_per_km;
      }
    }
    
    let totalPrice = pricingSettings.base_fare + (estimatedDistance * pricePerKm);
    
    if (pricingSettings.night_rate_enabled && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.night_rate_start?.split(':').map(Number) || [0, 0];
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      if (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      ) {
        const nightPercentage = pricingSettings.night_rate_percentage || 0;
        totalPrice += totalPrice * (nightPercentage / 100);
      }
    }
    
    if (totalPrice < pricingSettings.min_fare) {
      totalPrice = pricingSettings.min_fare;
    }
    
    setPrice(Math.round(totalPrice));
    
    setQuoteDetails({
      departureAddress,
      destinationAddress,
      date: date ? format(date, 'dd/MM/yyyy') : '',
      time,
      vehicleName: vehicle.name,
      vehicleModel: vehicle.model,
      distance: estimatedDistance,
      duration: estimatedDuration,
      baseFare: pricingSettings.base_fare,
      pricePerKm,
      totalPrice: Math.round(totalPrice)
    });
  }, [selectedVehicle, departureAddress, destinationAddress, date, time, estimatedDistance, vehicles, pricingSettings, distanceTiers]);
  
  const handleNextStep = () => {
    if (activeTab === 'step1') {
      if (!departureAddress || !destinationAddress || !date || !time || !selectedVehicle) {
        toast.error('Veuillez remplir tous les champs requis');
        return;
      }
      setActiveTab('step2');
    } else if (activeTab === 'step2') {
      setActiveTab('step3');
    }
  };
  
  const handlePreviousStep = () => {
    if (activeTab === 'step2') {
      setActiveTab('step1');
    } else if (activeTab === 'step3') {
      setActiveTab('step2');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    if (!departureCoordinates || !destinationCoordinates) {
      toast.error('Veuillez sélectionner des adresses valides pour le calcul du trajet');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error("Utilisateur non authentifié");
      }
      
      let clientId;
      const { data: existingClients, error: clientsError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .eq('driver_id', userId)
        .limit(1);
      
      if (clientsError) throw clientsError;
      
      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
      } else {
        const { data: newClient, error: createError } = await supabase
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
        
        if (createError) throw createError;
        clientId = newClient.id;
      }
      
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      dateTime.setHours(hours, minutes);
      
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      
      const quoteData: Omit<QuoteWithCoordinates, 'id' | 'created_at' | 'updated_at' | 'quote_pdf'> = {
        client_id: clientId,
        vehicle_id: selectedVehicle || null,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration,
        ride_date: dateTime.toISOString(),
        amount: price,
        status: 'pending',
        driver_id: ''
      };
      
      await addQuote.mutateAsync(quoteData);
      
      toast.success('Votre devis a été enregistré avec succès');
      setIsSubmitting(false);
      setIsQuoteSent(true);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du devis:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsSubmitting(false);
    }
  };

  const handleDepartureSelect = (address: Address) => {
    setDepartureCoordinates(address.coordinates);
  };

  const handleDestinationSelect = (address: Address) => {
    setDestinationCoordinates(address.coordinates);
  };

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };
  
  if (vehiclesLoading || pricingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Simulateur d'interface client</CardTitle>
          <CardDescription>
            Visualisez ce que vos clients verront lors d'une demande de devis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isQuoteSent ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Devis enregistré avec succès</h3>
              <p className="text-muted-foreground mb-6">
                Le devis a été enregistré et envoyé à l'adresse : {email}
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/dashboard/quotes')}>
                  Voir tous les devis
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveTab('step1');
                    setIsQuoteSent(false);
                  }}
                >
                  Créer un nouveau devis
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="step1">
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background">
                      1
                    </span>
                    Informations du trajet
                  </span>
                </TabsTrigger>
                <TabsTrigger value="step2">
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background">
                      2
                    </span>
                    Calcul du trajet
                  </span>
                </TabsTrigger>
                <TabsTrigger value="step3">
                  <span className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border mr-2 bg-background">
                      3
                    </span>
                    Informations client
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="step1" className="space-y-6">
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
              </TabsContent>
              
              <TabsContent value="step2" className="space-y-6">
                <div className="rounded-lg border bg-card p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium mb-1">Départ</p>
                      <p className="text-sm text-muted-foreground">{departureAddress || "Non spécifié"}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Destination</p>
                      <p className="text-sm text-muted-foreground">{destinationAddress || "Non spécifié"}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-medium">{date ? format(date, 'dd/MM/yyyy') : "Non spécifiée"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Heure</p>
                      <p className="text-sm font-medium">{time || "Non spécifiée"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Véhicule</p>
                      <p className="text-sm font-medium">
                        {vehicles.find(v => v.id === selectedVehicle)?.name || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Passagers</p>
                      <p className="text-sm font-medium">{passengers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[250px] rounded-lg border overflow-hidden">
                    {departureCoordinates && destinationCoordinates ? (
                      <RouteMap
                        departure={departureCoordinates}
                        destination={destinationCoordinates}
                        onRouteCalculated={handleRouteCalculated}
                      />
                    ) : (
                      <div className="flex flex-col h-full items-center justify-center p-4 bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">Carte du trajet</p>
                        <p className="text-xs">Sélectionnez des adresses valides pour afficher l'itinéraire</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-3">Détails du trajet</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Distance estimée</p>
                          <p className="text-sm font-medium">{estimatedDistance} km</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Durée estimée</p>
                          <p className="text-sm font-medium">{estimatedDuration} min</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Heure d'arrivée estimée</p>
                          <p className="text-sm font-medium">
                            {time ? (
                              (() => {
                                const [hours, minutes] = time.split(':').map(Number);
                                const arrivalTime = new Date();
                                arrivalTime.setHours(hours);
                                arrivalTime.setMinutes(minutes + estimatedDuration);
                                return format(arrivalTime, 'HH:mm');
                              })()
                            ) : "Non spécifiée"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-3">Détails du prix</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Forfait de base</p>
                          <p className="text-sm">{pricingSettings?.base_fare.toFixed(2)}€</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Tarif kilométrique</p>
                          <p className="text-sm">{quoteDetails?.pricePerKm.toFixed(2)}€/km</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Distance</p>
                          <p className="text-sm">{estimatedDistance} km</p>
                        </div>
                        
                        {pricingSettings?.night_rate_enabled && time && (
                          (() => {
                            const [hours, minutes] = time.split(':').map(Number);
                            const tripTime = new Date();
                            tripTime.setHours(hours);
                            tripTime.setMinutes(minutes);
                            
                            const startTime = new Date();
                            const [startHours, startMinutes] = pricingSettings.night_rate_start?.split(':').map(Number) || [0, 0];
                            startTime.setHours(startHours);
                            startTime.setMinutes(startMinutes);
                            
                            const endTime = new Date();
                            const [endHours, endMinutes] = pricingSettings.night_rate_end?.split(':').map(Number) || [0, 0];
                            endTime.setHours(endHours);
                            endTime.setMinutes(endMinutes);
                            
                            const isNight = (
                              (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
                              (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
                            );
                            
                            return isNight && (
                              <div className="flex justify-between">
                                <p className="text-sm">Majoration de nuit ({pricingSettings.night_rate_percentage}%)</p>
                                <p className="text-sm">+{((price * (pricingSettings.night_rate_percentage || 0) / 100)).toFixed(2)}€</p>
                              </div>
                            );
                          })()
                        )}
                        
                        <Separator className="my-2" />
                        
                        <div className="flex justify-between font-medium">
                          <p>Prix total</p>
                          <p className="text-lg">{price.toFixed(2)}€</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Retour
                  </Button>
                  <Button onClick={handleNextStep}>
                    Continuer
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="step3" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-lg border bg-muted p-4 mb-4">
                    <h3 className="font-medium mb-3">Résumé du devis</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Départ</p>
                        <p className="text-sm">{departureAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Destination</p>
                        <p className="text-sm">{destinationAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date et heure</p>
                        <p className="text-sm">{date ? format(date, 'dd/MM/yyyy') : ""} à {time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Véhicule</p>
                        <p className="text-sm">
                          {vehicles.find(v => v.id === selectedVehicle)?.name} - 
                          {vehicles.find(v => v.id === selectedVehicle)?.model}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between font-medium">
                      <p>Prix total</p>
                      <p className="text-xl">{price.toFixed(2)}€</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Vos informations</h3>
                    
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
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep} type="button">
                      Retour
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Recevoir le devis par email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSimulator;
