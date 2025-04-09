
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
import { CalendarIcon, MapIcon, SendIcon, CheckIcon } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { usePricing } from '@/hooks/use-pricing';
import { toast } from 'sonner';
import QuoteForm from '@/components/quote/QuoteForm';
import { supabase } from '@/integrations/supabase/client';

// Cette interface simulera une connexion API réelle pour les adresses
interface Address {
  id: string;
  name: string;
  fullAddress: string;
}

const mockAddresses: Address[] = [
  { id: '1', name: 'Aéroport Paris CDG', fullAddress: 'Aéroport Paris-Charles de Gaulle, 95700 Roissy-en-France' },
  { id: '2', name: 'Gare du Nord', fullAddress: '18 Rue de Dunkerque, 75010 Paris' },
  { id: '3', name: 'Tour Eiffel', fullAddress: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris' },
  { id: '4', name: 'Arc de Triomphe', fullAddress: 'Place Charles de Gaulle, 75008 Paris' },
  { id: '5', name: 'Disneyland Paris', fullAddress: 'Boulevard de Parc, 77700 Coupvray' },
];

const ClientSimulator = () => {
  const { user } = useAuth();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { 
    pricing, 
    loading: pricingLoading,
    distancePricingTiers
  } = usePricing();
  
  const [activeTab, setActiveTab] = useState('step1');
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
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
  
  // Au chargement, remplir les informations du chauffeur
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
  
  // Calculer le prix lorsque les données changent
  useEffect(() => {
    if (!selectedVehicle || !pricing || !distancePricingTiers) return;
    
    // Trouve le véhicule sélectionné
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    // Cherche les tarifs pour ce type de véhicule
    const vehicleTypeId = vehicle.vehicle_type_id;
    
    // Trouve le tarif au km applicable selon la distance
    let pricePerKm = pricing.price_per_km;
    
    if (distancePricingTiers && distancePricingTiers.length > 0) {
      // Filtre les tarifs pour le type de véhicule sélectionné ou sans type spécifique
      const applicableTiers = distancePricingTiers.filter(tier => 
        !tier.vehicle_type_id || tier.vehicle_type_id === vehicleTypeId
      );
      
      // Trouve le tier applicable selon la distance
      const applicableTier = applicableTiers.find(tier => 
        estimatedDistance >= tier.min_km && 
        (!tier.max_km || estimatedDistance <= tier.max_km)
      );
      
      if (applicableTier) {
        pricePerKm = applicableTier.price_per_km;
      }
    }
    
    // Calcul du prix de base
    let totalPrice = pricing.base_fare + (estimatedDistance * pricePerKm);
    
    // Vérifie si c'est la nuit
    if (pricing.night_rate_enabled && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const tripTime = new Date();
      tripTime.setHours(hours);
      tripTime.setMinutes(minutes);
      
      const startTime = new Date();
      const [startHours, startMinutes] = pricing.night_rate_start.split(':').map(Number);
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
      
      const endTime = new Date();
      const [endHours, endMinutes] = pricing.night_rate_end.split(':').map(Number);
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
      
      // Si l'heure de départ est pendant la nuit
      if (
        (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
        (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
      ) {
        // Applique la majoration de nuit
        totalPrice += totalPrice * (pricing.night_rate_percentage / 100);
      }
    }
    
    // Applique le tarif minimum si nécessaire
    if (totalPrice < pricing.min_fare) {
      totalPrice = pricing.min_fare;
    }
    
    // Arrondi à l'entier
    setPrice(Math.round(totalPrice));
    
    // Prépare les détails du devis
    setQuoteDetails({
      departureAddress,
      destinationAddress,
      date: date ? format(date, 'dd/MM/yyyy') : '',
      time,
      vehicleName: vehicle.name,
      vehicleModel: vehicle.model,
      distance: estimatedDistance,
      duration: estimatedDuration,
      baseFare: pricing.base_fare,
      pricePerKm,
      totalPrice: Math.round(totalPrice)
    });
    
  }, [selectedVehicle, departureAddress, destinationAddress, date, time, estimatedDistance, vehicles, pricing, distancePricingTiers]);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simuler l'envoi d'email (dans un vrai cas, appeler une API)
    setTimeout(() => {
      toast.success('Votre devis a été envoyé à votre adresse e-mail');
      setIsSubmitting(false);
      setIsQuoteSent(true);
    }, 1500);
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
              <h3 className="text-xl font-medium mb-2">Devis envoyé avec succès</h3>
              <p className="text-muted-foreground mb-6">
                Votre devis a été envoyé à l'adresse : {email}
              </p>
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
                    <div className="space-y-2">
                      <Label htmlFor="departure">Adresse de départ</Label>
                      <div className="relative">
                        <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <select 
                          id="departure"
                          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={departureAddress}
                          onChange={(e) => setDepartureAddress(e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez une adresse de départ</option>
                          {mockAddresses.map(address => (
                            <option key={address.id} value={address.fullAddress}>
                              {address.name} - {address.fullAddress}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Adresse de destination</Label>
                      <div className="relative">
                        <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <select 
                          id="destination"
                          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={destinationAddress}
                          onChange={(e) => setDestinationAddress(e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez une adresse de destination</option>
                          {mockAddresses.map(address => (
                            <option key={address.id} value={address.fullAddress}>
                              {address.name} - {address.fullAddress}
                            </option>
                          ))}
                        </select>
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
                  <div className="flex flex-col h-[250px] rounded-lg border bg-muted items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground mb-1">Carte du trajet</p>
                    <p className="text-xs">(Simulée - Dans une version réelle, une carte interactive serait affichée ici)</p>
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
                          <p className="text-sm">{pricing?.base_fare.toFixed(2)}€</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Tarif kilométrique</p>
                          <p className="text-sm">{quoteDetails?.pricePerKm.toFixed(2)}€/km</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Distance</p>
                          <p className="text-sm">{estimatedDistance} km</p>
                        </div>
                        
                        {pricing?.night_rate_enabled && time && (
                          (() => {
                            const [hours, minutes] = time.split(':').map(Number);
                            const tripTime = new Date();
                            tripTime.setHours(hours);
                            tripTime.setMinutes(minutes);
                            
                            const startTime = new Date();
                            const [startHours, startMinutes] = pricing.night_rate_start.split(':').map(Number);
                            startTime.setHours(startHours);
                            startTime.setMinutes(startMinutes);
                            
                            const endTime = new Date();
                            const [endHours, endMinutes] = pricing.night_rate_end.split(':').map(Number);
                            endTime.setHours(endHours);
                            endTime.setMinutes(endMinutes);
                            
                            // Si l'heure de départ est pendant la nuit
                            const isNight = (
                              (startTime > endTime && (tripTime >= startTime || tripTime <= endTime)) ||
                              (startTime < endTime && tripTime >= startTime && tripTime <= endTime)
                            );
                            
                            return isNight && (
                              <div className="flex justify-between">
                                <p className="text-sm">Majoration de nuit ({pricing.night_rate_percentage}%)</p>
                                <p className="text-sm">+{((price * pricing.night_rate_percentage / 100)).toFixed(2)}€</p>
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
                          <SendIcon className="h-4 w-4 mr-2" />
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
