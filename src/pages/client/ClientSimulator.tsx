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
import { 
  CalendarIcon, 
  CheckIcon, 
  Send, 
  ArrowLeftRight, 
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

const ClientSimulator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { addQuote } = useQuotes();
  const { getRoute } = useMapbox();
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
  
  // Options pour trajet aller-retour
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  
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
  
  // Calculate waiting time price
  useEffect(() => {
    if (!hasWaitingTime || !pricingSettings) return;
    
    const pricePerMin = pricingSettings.waiting_fee_per_minute || 0.5;
    const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
    
    // Calculate by quarter-hour increments using wait_price_per_15min
    const quarters = Math.ceil(waitingTimeMinutes / 15);
    let price = quarters * pricePerQuarter;
    
    // Apply night rate if enabled
    if (pricingSettings.wait_night_enabled && pricingSettings.wait_night_percentage && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricingSettings.wait_night_start?.split(':').map(Number) || [0, 0];
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
      
      if (isNight) {
        const nightPercentage = pricingSettings.wait_night_percentage || 0;
        price += price * (nightPercentage / 100);
      }
    }
    
    setWaitingTimePrice(Math.round(price));
  }, [hasWaitingTime, waitingTimeMinutes, pricingSettings, time]);
  
  // Calculate return trip distance and duration
  useEffect(() => {
    const calculateReturnRoute = async () => {
      if (!hasReturnTrip || returnToSameAddress || !customReturnCoordinates || !destinationCoordinates) {
        return;
      }
      
      try {
        const route = await getRoute(destinationCoordinates, customReturnCoordinates);
        if (route) {
          setReturnDistance(Math.round(route.distance));
          setReturnDuration(Math.round(route.duration));
        }
      } catch (error) {
        console.error("Erreur lors du calcul de l'itinéraire de retour:", error);
      }
    };
    
    calculateReturnRoute();
  }, [hasReturnTrip, returnToSameAddress, customReturnCoordinates, destinationCoordinates, getRoute]);
  
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
    
    // Prix de base pour le trajet aller
    let oneWayPrice = pricingSettings.base_fare + (estimatedDistance * pricePerKm);
    
    // Appliquer le tarif de nuit si actif
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
        oneWayPrice += oneWayPrice * (nightPercentage / 100);
      }
    }
    
    // Appliquer le prix minimum si nécessaire
    if (oneWayPrice < pricingSettings.min_fare) {
      oneWayPrice = pricingSettings.min_fare;
    }
    
    // Calculer le prix du retour si nécessaire
    let returnPrice = 0;
    if (hasReturnTrip) {
      if (returnToSameAddress) {
        returnPrice = oneWayPrice;
      } else if (returnDistance > 0) {
        returnPrice = pricingSettings.base_fare + (returnDistance * pricePerKm);
        
        // Appliquer le prix minimum si nécessaire
        if (returnPrice < pricingSettings.min_fare) {
          returnPrice = pricingSettings.min_fare;
        }
      }
    }
    
    // Calculer le prix total
    const totalPrice = oneWayPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
    
    setPrice(Math.round(totalPrice));
    
    setQuoteDetails({
      departureAddress,
      destinationAddress,
      customReturnAddress,
      date: date ? format(date, 'dd/MM/yyyy') : '',
      time,
      vehicleName: vehicle.name,
      vehicleModel: vehicle.model,
      distance: estimatedDistance,
      duration: estimatedDuration,
      returnDistance,
      returnDuration,
      baseFare: pricingSettings.base_fare,
      pricePerKm,
      oneWayPrice: Math.round(oneWayPrice),
      waitingTimePrice: hasWaitingTime ? waitingTimePrice : 0,
      returnPrice: Math.round(returnPrice),
      totalPrice: Math.round(totalPrice),
      hasReturnTrip,
      hasWaitingTime,
      waitingTimeMinutes,
      returnToSameAddress
    });
  }, [
    selectedVehicle, departureAddress, destinationAddress, date, time, 
    estimatedDistance, vehicles, pricingSettings, distanceTiers,
    hasReturnTrip, hasWaitingTime, waitingTimePrice, waitingTimeMinutes,
    returnToSameAddress, customReturnAddress, returnDistance
  ]);
  
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
    
    if (hasReturnTrip && !returnToSameAddress && !customReturnAddress) {
      toast.error('Veuillez spécifier une adresse de retour');
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
      
      const dateTime = new Date(date!);
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
        driver_id: '',
        has_return_trip: hasReturnTrip,
        has_waiting_time: hasWaitingTime,
        waiting_time_minutes: hasWaitingTime ? waitingTimeMinutes : 0,
        waiting_time_price: hasWaitingTime ? waitingTimePrice : 0,
        return_to_same_address: returnToSameAddress,
        custom_return_address: customReturnAddress,
        return_coordinates: customReturnCoordinates,
        return_distance_km: returnDistance,
        return_duration_minutes: returnDuration
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

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
  };

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };
  
  // Generate waiting time options in 15-minute increments
  const waitingTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const minutes = (i + 1) * 15;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let label = "";
    if (hours > 0) {
      label += `${hours} heure${hours > 1 ? 's' : ''}`;
      if (remainingMinutes > 0) {
        label += ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else {
      label = `${minutes} minutes`;
    }
    
    return {
      value: minutes,
      label
    };
  });
  
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
                  
                  {hasReturnTrip && !returnToSameAddress && (
                    <div className="mt-4">
                      <p className="font-medium mb-1">Adresse de retour</p>
                      <p className="text-sm text-muted-foreground">{customReturnAddress || "Non spécifiée"}</p>
                    </div>
                  )}
                  
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
                  
                  {hasReturnTrip && (
                    <div className="mt-4 p-2 bg-secondary/30 rounded-md">
                      <div className="flex items-center">
                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium">Aller-retour avec {hasWaitingTime ? `attente de ${waitingTimeMinutes} minutes` : 'retour immédiat'}</p>
                      </div>
                    </div>
                  )}
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
                          <p className="text-sm">Distance estimée (aller)</p>
                          <p className="text-sm font-medium">{estimatedDistance} km</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Durée estimée (aller)</p>
                          <p className="text-sm font-medium">{estimatedDuration} min</p>
                        </div>
                        
                        {hasReturnTrip && !returnToSameAddress && customReturnCoordinates && (
                          <>
                            <div className="flex justify-between">
                              <p className="text-sm">Distance estimée (retour)</p>
                              <p className="text-sm font-medium">{returnDistance} km</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">Durée estimée (retour)</p>
                              <p className="text-sm font-medium">{returnDuration} min</p>
                            </div>
                          </>
                        )}
                        
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
                          <div className="flex items-center">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            <p className="text-sm">Trajet aller</p>
                          </div>
                          <p className="text-sm font
