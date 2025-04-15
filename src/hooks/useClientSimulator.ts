
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuoteForm } from '@/hooks/useQuoteForm';

export const useClientSimulator = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const resetQuoteForm = useQuoteForm().resetForm;

  const submitQuote = async (quoteData: any, clientData: any) => {
    setIsSubmitting(true);
    try {
      // Get current authenticated driver
      const { data: { session } } = await supabase.auth.getSession();
      const driverId = session?.user?.id;
      
      if (!driverId) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Check if client exists or create new client
      let clientId = '';
      
      if (clientData.firstName && clientData.lastName) {
        const { data: existingClients, error: searchError } = await supabase
          .from('clients')
          .select('id')
          .eq('driver_id', driverId)
          .eq('email', clientData.email)
          .eq('first_name', clientData.firstName)
          .eq('last_name', clientData.lastName)
          .limit(1);
          
        if (searchError) throw searchError;
        
        if (existingClients && existingClients.length > 0) {
          clientId = existingClients[0].id;
        } else {
          // Create new client
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert({
              driver_id: driverId,
              first_name: clientData.firstName,
              last_name: clientData.lastName,
              email: clientData.email,
              phone: clientData.phone || '',
              client_type: 'personal'
            })
            .select('id')
            .single();
            
          if (createError) throw createError;
          if (newClient) clientId = newClient.id;
        }
      }
      
      if (!clientId) {
        throw new Error("Impossible de créer ou retrouver le client");
      }
      
      // Create the quote
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert({
          driver_id: driverId,
          client_id: clientId,
          vehicle_id: quoteData.vehicle_id,
          departure_location: quoteData.departure_location,
          arrival_location: quoteData.arrival_location,
          departure_coordinates: quoteData.departure_coordinates,
          arrival_coordinates: quoteData.arrival_coordinates,
          distance_km: quoteData.distance_km,
          duration_minutes: quoteData.duration_minutes,
          ride_date: quoteData.ride_date,
          amount: quoteData.amount,
          status: "pending",
          has_return_trip: quoteData.has_return_trip,
          has_waiting_time: quoteData.has_waiting_time,
          waiting_time_minutes: quoteData.waiting_time_minutes,
          waiting_time_price: quoteData.waiting_time_price,
          return_to_same_address: quoteData.return_to_same_address,
          custom_return_address: quoteData.custom_return_address,
          return_coordinates: quoteData.return_coordinates,
          return_distance_km: quoteData.return_distance_km,
          return_duration_minutes: quoteData.return_duration_minutes
        });
        
      if (quoteError) throw quoteError;
      
      toast({
        title: 'Devis envoyé',
        description: "Votre demande de devis a été envoyée avec succès",
      });
      
      setIsQuoteSent(true);
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsQuoteSent(false);
    resetQuoteForm();
  };
  
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  return {
    isSubmitting,
    isQuoteSent,
    submitQuote,
    resetForm,
    navigateToDashboard
  };
};
