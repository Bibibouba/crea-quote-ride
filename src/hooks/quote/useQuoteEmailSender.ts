
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
      console.log("📧 Préparation de l'envoi d'email au client:", clientName);
      console.log("📧 Adresse email:", email);
      
      const shortQuoteId = quote.id.substring(0, 8);
      console.log("📧 Identifiant court du devis pour l'email:", shortQuoteId);
      
      // Validation des données
      if (!email || !email.includes('@')) {
        console.error('📧 ❌ Adresse email invalide:', email);
        toast({
          title: "Erreur d'envoi",
          description: "L'adresse email du client est invalide",
          variant: "destructive",
        });
        throw new Error("L'adresse email du client est invalide");
      }
      
      if (!clientName || clientName.trim() === '') {
        console.error('📧 ❌ Nom du client manquant');
        toast({
          title: "Erreur d'envoi",
          description: "Le nom du client est requis pour l'envoi de l'email",
          variant: "destructive",
        });
        throw new Error("Le nom du client est requis pour l'envoi de l'email");
      }
      
      if (!departureAddress || !destinationAddress) {
        console.error('📧 ❌ Adresses manquantes pour l\'email:', { departureAddress, destinationAddress });
        toast({
          title: "Erreur d'envoi",
          description: "Les adresses de départ et d'arrivée sont requises",
          variant: "destructive",
        });
        throw new Error("Les adresses de départ et d'arrivée sont requises");
      }
      
      console.log("📧 Préparation du payload pour la fonction Edge send-quote:", {
        clientName,
        clientEmail: email,
        quoteId: shortQuoteId,
        departureLocation: departureAddress,
        arrivalLocation: destinationAddress,
        rideDate: quote.ride_date,
        amount: quote.amount,
      });
      
      // Timestamp de début pour mesurer la performance
      const startTime = Date.now();
      
      // Appel à la fonction Edge
      console.log("📧 Invocation de la fonction Edge send-quote...");
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

      // Temps d'exécution
      const duration = Date.now() - startTime;
      console.log(`📧 Temps d'exécution de la fonction Edge: ${duration}ms`);

      // Gestion de la réponse
      if (emailError) {
        console.error('📧 ❌ Erreur lors de l\'appel à la fonction d\'envoi d\'email:', emailError);
        toast({
          title: "Erreur d'envoi",
          description: `L'envoi de l'email a échoué: ${emailError.message || 'Erreur inconnue'}`,
          variant: "destructive",
        });
        throw emailError;
      }
      
      console.log("📧 Réponse de la fonction d'envoi d'email:", emailData);
      
      if (emailData && emailData.success === false) {
        const errorMsg = emailData.error || "Erreur côté serveur lors de l'envoi";
        console.error("📧 ❌ Échec de l'envoi d'email:", errorMsg);
        toast({
          title: "Erreur d'envoi",
          description: `L'envoi de l'email a échoué: ${errorMsg}`,
          variant: "destructive",
        });
        throw new Error(errorMsg);
      }
      
      console.log("📧 ✅ Email envoyé avec succès au client:", email);
      toast({
        title: "Email envoyé",
        description: "Le devis a été envoyé par email au client",
      });
      
      return true;
    } catch (error) {
      console.error('📧 ❌ Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  };

  return { sendQuoteEmail };
};
