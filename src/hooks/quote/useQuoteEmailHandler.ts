
import { useQuoteEmailSender } from './useQuoteEmailSender';
import { useToast } from '@/hooks/use-toast';
import { Quote } from '@/types/quote';

export const useQuoteEmailHandler = () => {
  const { sendQuoteEmail } = useQuoteEmailSender();
  const { toast } = useToast();
  
  const handleEmailSending = async (
    email: string | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    quote: Quote,
    departureAddress: string,
    destinationAddress: string
  ) => {
    if (!email) {
      console.log("📧 Pas d'email fourni, le devis est enregistré sans envoi d'email");
      toast({
        title: 'Devis enregistré',
        description: 'Votre devis a été enregistré avec succès',
      });
      return true;
    }
    
    try {
      let fullName = '';
      if (firstName && lastName) {
        fullName = `${firstName} ${lastName}`.trim();
      } else if (firstName) {
        fullName = firstName.trim();
      } else if (lastName) {
        fullName = lastName.trim();
      } else {
        fullName = "Client";
      }
      
      await sendQuoteEmail({
        clientName: fullName,
        email,
        quote,
        departureAddress,
        destinationAddress
      });
      
      toast({
        title: 'Devis envoyé',
        description: 'Le devis a été enregistré et envoyé par email.',
      });
      return true;
    } catch (error) {
      console.error('📧 ❌ Erreur lors de l\'envoi de l\'email:', error);
      toast({
        title: 'Devis enregistré',
        description: 'Le devis a été enregistré mais l\'envoi par email a échoué.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  return { handleEmailSending };
};
