
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { prepareQuoteData } from '@/hooks/quote/utils/prepareQuoteData';

interface CreateQuoteParams {
  driverId: string;
  clientId: string;
  quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf">;
}

export const quoteService = {
  async createQuote({ driverId, clientId, quoteData }: CreateQuoteParams): Promise<Quote> {
    console.log("Creating quote for driver_id:", driverId);
    
    // Make sure we have a valid status value that matches the Quote type
    const validatedQuoteData = {
      ...quoteData,
      status: quoteData.status as Quote['status']
    };
    
    const { data, error } = await supabase
      .from('quotes')
      .insert(validatedQuoteData)
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
