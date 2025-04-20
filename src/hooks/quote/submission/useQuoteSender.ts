
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/hooks/use-toast';
import { useQuoteEmailSender } from '../useQuoteEmailSender';
import { Quote } from '@/types/quote';

interface QuoteSenderProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  quote: Quote;
  departureAddress: string;
  destinationAddress: string;
}

export const useQuoteSender = () => {
  const { toast } = useToast();
  const { sendQuoteEmail } = useQuoteEmailSender();

  const sendQuote = async ({ 
    email, 
    firstName, 
    lastName, 
    quote,
    departureAddress,
    destinationAddress 
  }: QuoteSenderProps) => {
    if (!email) {
      console.log("📧 Pas d'email fourni, le devis est enregistré sans envoi d'email");
      return;
    }

    console.log("📧 Client a fourni une adresse email, tentative d'envoi:", email);
    
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
      
      console.log("📧 Préparation de l'envoi d'email à", fullName, "sur", email);
      
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
      
    } catch (emailError) {
      console.error('📧 ❌ Erreur lors de l\'envoi de l\'email:', emailError);
      toast({
        title: 'Devis enregistré',
        description: 'Le devis a été enregistré mais l\'envoi par email a échoué.',
        variant: 'destructive',
      });
      throw emailError;
    }
  };

  return { sendQuote };
};
