
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
      
      // Log quote details before submission
      console.log('Submitting quote with day/night details:', {
        day_km: quoteData.day_km,
        night_km: quoteData.night_km,
        day_price: quoteData.day_price,
        night_price: quoteData.night_price,
        wait_time_day: quoteData.wait_time_day,
        wait_time_night: quoteData.wait_time_night,
        wait_price_day: quoteData.wait_price_day,
        wait_price_night: quoteData.wait_price_night,
        total_ht: quoteData.total_ht,
        vat: quoteData.vat,
        total_ttc: quoteData.total_ttc || quoteData.amount
      });
      
      // Adapter les noms de colonnes pour la base de données
      const insertData = {
        driver_id: driverId,
        client_id: clientId,
        vehicle_type_id: quoteData.vehicle_id, // Adaptation pour la colonne de la BDD
        departure_location: quoteData.departure_location,
        arrival_location: quoteData.arrival_location,
        departure_coordinates: quoteData.departure_coordinates,
        arrival_coordinates: quoteData.arrival_coordinates,
        total_distance: quoteData.distance_km, // Adaptation pour la colonne de la BDD
        outbound_duration_minutes: quoteData.duration_minutes, // Adaptation pour la colonne de la BDD
        departure_datetime: quoteData.ride_date, // Adaptation pour la colonne de la BDD
        total_fare: quoteData.amount, // Adaptation pour la colonne de la BDD
        status: "pending",
        include_return: quoteData.has_return_trip, // Adaptation pour la colonne de la BDD
        has_waiting_time: quoteData.has_waiting_time,
        waiting_time_minutes: quoteData.waiting_time_minutes,
        waiting_fare: quoteData.waiting_time_price, // Adaptation pour la colonne de la BDD
        return_to_same_address: quoteData.return_to_same_address,
        custom_return_address: quoteData.custom_return_address,
        return_coordinates: quoteData.return_coordinates,
        return_duration_minutes: quoteData.return_duration_minutes,
        // Ajouter base_fare qui est un champ obligatoire
        base_fare: quoteData.base_price || 0,
        // Autres champs pour les tarifs jour/nuit
        day_km: quoteData.day_km || 0,
        night_km: quoteData.night_km || 0,
        day_price: quoteData.day_price || 0,
        night_price: quoteData.night_price || 0
      };
      
      // Create the quote
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert(insertData);
        
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
