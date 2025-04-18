
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
      console.log("Sending email to:", email);
      
      const shortQuoteId = quote.id.substring(0, 8);
      console.log("Short quote ID for email:", shortQuoteId);
      
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

      console.log("Email function response:", emailData);
      
      if (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        throw emailError;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  };

  return { sendQuoteEmail };
};
