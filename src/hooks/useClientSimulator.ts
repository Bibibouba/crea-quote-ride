
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuotes } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { Quote } from '@/types/quote';
import { useNavigate } from 'react-router-dom';

export const useClientSimulator = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteSent, setIsQuoteSent] = useState(false);
  const { toast } = useToast();
  const { addQuote } = useQuotes();
  const { addClient } = useClients();
  const navigate = useNavigate();
  
  // Fonction pour soumettre un devis dans le simulateur client
  const submitQuote = async (quoteData: Partial<Quote>, clientData: { firstName: string; lastName: string; email: string; phone?: string }) => {
    if (!quoteData.departure_location || !quoteData.arrival_location) {
      toast({
        title: 'Données incomplètes',
        description: 'Veuillez remplir les adresses de départ et d\'arrivée',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }
      
      console.log('Creating client and quote for driver:', session.user.id);
      
      // 1. Créer d'abord le client
      const newClientResult = await addClient.mutateAsync({
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone || '',
        client_type: 'personal'
      });
      
      console.log('Client created successfully:', newClientResult);
      
      // 2. Puis créer le devis associé à ce client
      if (newClientResult && newClientResult.id) {
        const completeQuoteData = {
          ...quoteData,
          client_id: newClientResult.id,
          status: 'pending' as const
        };
        
        console.log('Creating quote with data:', completeQuoteData);
        
        const newQuoteResult = await addQuote.mutateAsync(completeQuoteData as any);
        
        console.log('Quote created successfully:', newQuoteResult);
        
        toast({
          title: 'Devis envoyé',
          description: 'Votre devis a été envoyé avec succès',
        });
        
        setIsQuoteSent(true);
      }
    } catch (error) {
      console.error('Error in submitQuote:', error);
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'envoi du devis: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsQuoteSent(false);
  };
  
  const navigateToDashboard = () => {
    navigate('/dashboard/quotes');
  };
  
  return {
    isSubmitting,
    isQuoteSent,
    submitQuote,
    resetForm,
    navigateToDashboard
  };
};
