import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';
import AddressFormSection from '@/components/quote/form/AddressFormSection';
import ClientInfoSection from './form/ClientInfoSection';
import QuoteSummary from './form/QuoteSummary';
import SuccessMessage from './form/SuccessMessage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormItem } from '@/components/ui/form';
import { usePricing } from '@/hooks/use-pricing';
import { useMapbox, Address } from '@/hooks/useMapbox';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuoteFormOptions from './form/QuoteFormOptions';
import { Quote } from '@/types/quote';

interface QuoteFormProps {
  clientId?: string;
  onSuccess?: () => void;
  showDashboardLink?: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ clientId, onSuccess, showDashboardLink = true }) => {
  const { user } = useAuth();
  const { addQuote } = useQuotes();
  const { clients } = useClients();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pricingSettings } = usePricing();
  const { getRoute } = useMapbox();
  
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
  const [phone, setPhone] = useState('');
  
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [hasWaitingTime, setHasWaitingTime] = useState(false);
  const [waitingTimeMinutes, setWaitingTimeMinutes] = useState(15);
  const [waitingTimePrice, setWaitingTimePrice] = useState(0);
  const [returnToSameAddress, setReturnToSameAddress] = useState(true);
  const [customReturnAddress, setCustomReturnAddress] = useState('');
  const [customReturnCoordinates, setCustomReturnCoordinates] = useState<[number, number] | undefined>(undefined);
  const [returnDistance, setReturnDistance] = useState(0);
  const [returnDuration, setReturnDuration] = useState(0);
  
  const vehicles = [
    { id: "sedan", name: "Berline", basePrice: 1.8, description: "Mercedes Classe E ou équivalent" },
    { id: "van", name: "Van", basePrice: 2.2, description: "Mercedes Classe V ou équivalent" },
    { id: "luxury", name: "Luxe", basePrice: 2.5, description: "Mercedes Classe S ou équivalent" }
  ];
  
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  const estimatedPrice = Math.round(estimatedDistance * basePrice);
  
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
    if (!hasWaitingTime || !pricingSettings) return;
    
    const pricePerMin = pricingSettings.waiting_fee_per_minute || 0.5;
    const pricePerQuarter = pricingSettings.wait_price_per_15min || 7.5;
    
    const quarters = Math.ceil(waitingTimeMinutes / 15);
    let price = quarters * pricePerQuarter;
    
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
      const [endHours, endMinutes] = pricingSettings.wait_night_end?.split(':').map(Number) || [0, 0];
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
  
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client.id);
        setFirstName(client.first_name);
        setLastName(client.last_name);
        setEmail(client.email);
        setPhone(client.phone);
      }
    }
  }, [clientId, clients]);
  
  useEffect(() => {
    if (user && !clientId) {
      const fetchUserInfo = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, phone')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFirstName(data.first_name || '');
            setLastName(data.last_name || '');
            setEmail(data.email || user.email || '');
            setPhone(data.phone || user.email || '');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, [user, clientId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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

  const handleReturnAddressSelect = (address: Address) => {
    setCustomReturnAddress(address.fullAddress);
    setCustomReturnCoordinates(address.coordinates);
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
    
    if (hasReturnTrip && !returnToSameAddress && !customReturnAddress) {
      toast({
        title: 'Adresse de retour manquante',
        description: 'Veuillez spécifier une adresse de retour',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const { data: { session } } = await supabase.auth.getSession();
      const driverId = session?.user?.id;
      
      if (!driverId) {
        throw new Error("Utilisateur non authentifié");
      }
      
      let finalClientId = selectedClient;
      
      if ((!selectedClient || selectedClient === '') && firstName && lastName) {
        console.log("Creating new client with driver_id:", driverId);
        
        const { data, error } = await supabase
          .from('clients')
          .insert({
            driver_id: driverId,
            first_name: firstName,
            last_name: lastName,
            email: email || '',
            phone: phone || '',
            client_type: 'personal'
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating client:", error);
          throw error;
        }
        
        console.log("Created new client:", data);
        finalClientId = data.id;
        
        toast({
          title: 'Client créé',
          description: `${firstName} ${lastName} a été ajouté à votre liste de clients`,
        });
      }
      
      if (!finalClientId) {
        throw new Error("Aucun client spécifié pour ce devis");
      }
      
      const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
      const oneWayPrice = estimatedDistance * basePrice;
      const returnPrice = hasReturnTrip 
        ? (returnToSameAddress ? estimatedDistance * basePrice : returnDistance * basePrice) 
        : 0;
      
      let totalPriceCalculated = oneWayPrice;
      if (hasWaitingTime) {
        totalPriceCalculated += waitingTimePrice;
      }
      if (hasReturnTrip) {
        totalPriceCalculated += returnPrice;
      }
      
      console.log("Creating quote for driver_id:", driverId);
      
      const quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf"> = {
        driver_id: driverId,
        client_id: finalClientId,
        vehicle_id: selectedVehicle,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration, 
        ride_date: dateTime.toISOString(),
        amount: totalPriceCalculated,
        status: "pending",
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

  const handleRouteCalculated = (distance: number, duration: number) => {
    setEstimatedDistance(Math.round(distance));
    setEstimatedDuration(Math.round(duration));
  };

  const handleReset = () => {
    setShowQuote(false);
    setIsQuoteSent(false);
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
                onRouteCalculated={handleRouteCalculated}
                vehicles={vehicles}
              />
              
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
            <SuccessMessage 
              onCreateNew={handleReset} 
              showDashboardLink={showDashboardLink}
            />
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
            <QuoteSummary 
              departureAddress={departureAddress}
              destinationAddress={destinationAddress}
              departureCoordinates={departureCoordinates}
              destinationCoordinates={destinationCoordinates}
              date={date}
              time={time}
              estimatedDistance={estimatedDistance}
              estimatedDuration={estimatedDuration}
              selectedVehicle={selectedVehicle}
              passengers={passengers}
              basePrice={basePrice}
              estimatedPrice={estimatedPrice}
              isSubmitting={isSubmitting}
              onSaveQuote={handleSaveQuote}
              onEditQuote={() => setShowQuote(false)}
              showClientInfo={!clientId}
              clientInfoComponent={
                !clientId ? (
                  <ClientInfoSection 
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                  />
                ) : undefined
              }
              vehicles={vehicles}
              hasReturnTrip={hasReturnTrip}
              hasWaitingTime={hasWaitingTime}
              waitingTimeMinutes={waitingTimeMinutes}
              waitingTimePrice={waitingTimePrice}
              returnToSameAddress={returnToSameAddress}
              customReturnAddress={customReturnAddress}
              returnDistance={returnDistance}
              returnDuration={returnDuration}
              returnCoordinates={customReturnCoordinates}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuoteForm;
