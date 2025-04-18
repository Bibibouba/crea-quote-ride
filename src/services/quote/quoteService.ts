
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { QuoteDetailsType } from '@/types/quoteForm';

interface CreateQuoteParams {
  driverId: string;
  clientId: string;
  quoteData: ReturnType<typeof prepareQuoteData>;
}

export const quoteService = {
  async createQuote({ driverId, clientId, quoteData }: CreateQuoteParams): Promise<Quote> {
    console.log("Creating quote for driver_id:", driverId);
    
    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
    
    console.log("Quote created successfully:", data);
    return data;
  }
};
