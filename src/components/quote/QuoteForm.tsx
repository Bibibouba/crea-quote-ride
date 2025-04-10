import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuotes, QuoteWithCoordinates } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';
import AddressFormSection from './form/AddressFormSection';
import ClientInfoSection from './form/ClientInfoSection';
import QuoteSummary from './form/QuoteSummary';
import SuccessMessage from './form/SuccessMessage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  const vehicles = [
    { id: "sedan", name: "Berline", basePrice: 1.8, description: "Mercedes Classe E ou équivalent" },
    { id: "van", name: "Van", basePrice: 2.2, description: "Mercedes Classe V ou équivalent" },
    { id: "luxury", name: "Luxe", basePrice: 2.5, description: "Mercedes Classe S ou équivalent" }
  ];
  
  const basePrice = vehicles.find(v => v.id === selectedVehicle)?.basePrice || 1.8;
  const estimatedPrice = Math.round(estimatedDistance * basePrice);
  
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
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      let finalClientId = selectedClient;
      
      if (!selectedClient && firstName && lastName && email) {
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
      
      const quoteData: Omit<QuoteWithCoordinates, 'id' | 'created_at' | 'updated_at' | 'quote_pdf'> = {
        client_id: finalClientId,
        vehicle_id: null,
        departure_location: departureAddress,
        arrival_location: destinationAddress,
        departure_coordinates: departureCoordinates,
        arrival_coordinates: destinationCoordinates,
        distance_km: estimatedDistance,
        duration_minutes: estimatedDuration, 
        ride_date: dateTime.toISOString(),
        amount: estimatedPrice,
        status: 'pending',
        driver_id: ''
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
            <SuccessMessage onCreateNew={handleReset} />
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
                  />
                ) : undefined
              }
              vehicles={vehicles}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuoteForm;
