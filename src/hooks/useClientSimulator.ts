
import { useState, useRef, useEffect } from 'react';
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
  const isMounted = useRef(true);

  // Cleanup function when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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
      
      // Créer objet compatible avec la structure de la table quotes
      const quotePayload = {
        base_fare: quoteData.base_fare || 0,
        departure_datetime: quoteData.ride_date || new Date().toISOString(),
        driver_id: driverId,
        outbound_duration_minutes: quoteData.duration_minutes || 0,
        total_distance: quoteData.distance_km || 0,
        total_fare: quoteData.amount || 0,
        vehicle_type_id: quoteData.vehicle_id || null,
        waiting_fare: quoteData.waiting_time_price || 0,
        waiting_time_minutes: quoteData.waiting_time_minutes || 0,
        include_return: quoteData.has_return_trip || false,
        return_duration_minutes: quoteData.return_duration_minutes || 0,
        night_surcharge: quoteData.night_surcharge || 0,
        holiday_surcharge: quoteData.sunday_holiday_surcharge || 0,
        sunday_surcharge: quoteData.sunday_holiday_surcharge || 0
      };
      
      // Créer le devis
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert(quotePayload);
        
      if (quoteError) throw quoteError;
      
      // Vérifier si le composant est toujours monté avant de mettre à jour l'état
      if (isMounted.current) {
        toast({
          title: 'Devis envoyé',
          description: "Votre demande de devis a été envoyée avec succès",
        });
        
        setIsQuoteSent(true);
      }
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      
      // Vérifier si le composant est toujours monté avant de montrer le toast
      if (isMounted.current) {
        toast({
          title: 'Erreur',
          description: `Une erreur est survenue: ${error.message}`,
          variant: 'destructive',
        });
      }
    } finally {
      // Vérifier si le composant est toujours monté avant de mettre à jour l'état
      if (isMounted.current) {
        setIsSubmitting(false);
      }
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
