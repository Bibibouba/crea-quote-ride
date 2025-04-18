
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Quote } from '@/types/quote';

interface EmailData {
  clientName: string;
  email: string;
  quote: Quote;
  departureAddress: string;
  destinationAddress: string;
}

export const useQuoteEmailSender = () => {
  const { toast } = useToast();

  const sendQuoteEmail = async ({ clientName, email, quote, departureAddress, destinationAddress }: EmailData) => {
    try {
      console.log("Préparation de l'envoi d'email à:", email);
      
      const shortQuoteId = quote.id.substring(0, 8);
      console.log("Identifiant court du devis pour l'email:", shortQuoteId);
      
      // Vérifier que l'adresse email est valide
      if (!email || !email.includes('@')) {
        console.error('Adresse email invalide:', email);
        throw new Error("L'adresse email du client est invalide");
      }
      
      // Vérifier que les données nécessaires sont présentes
      if (!clientName || !departureAddress || !destinationAddress) {
        console.error('Données manquantes pour l\'email:', { clientName, departureAddress, destinationAddress });
        throw new Error("Des informations essentielles sont manquantes pour l'envoi de l'email");
      }
      
      console.log("Appel de la fonction Edge send-quote avec les données:", {
        clientName,
        clientEmail: email,
        quoteId: shortQuoteId,
        departureLocation: departureAddress,
        arrivalLocation: destinationAddress,
        rideDate: quote.ride_date,
        amount: quote.amount,
      });
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-quote', {
        body: {
          clientName,
          clientEmail: email,
          quoteId: shortQuoteId,
          departureLocation: departureAddress,
          arrivalLocation: destinationAddress,
          rideDate: quote.ride_date,
          amount: quote.amount,
        },
      });

      if (emailError) {
        console.error('Erreur lors de l\'appel à la fonction d\'envoi d\'email:', emailError);
        throw emailError;
      }
      
      console.log("Réponse de la fonction d'envoi d'email:", emailData);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  };

  return { sendQuoteEmail };
};
