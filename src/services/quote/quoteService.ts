
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quote';
import { validateQuoteStatus } from './utils/validateQuoteStatus';

interface CreateQuoteParams {
  driverId: string;
  clientId: string;
  quoteData: Omit<Quote, "id" | "created_at" | "updated_at" | "quote_pdf">;
}

export const quoteService = {
  async createQuote({ driverId, clientId, quoteData }: CreateQuoteParams): Promise<Quote> {
    console.log("Creating quote for driver_id:", driverId);
    
    // Préparer les données pour la table quotes
    const quotePrepared = {
      driver_id: driverId,
      departure_datetime: quoteData.ride_date,
      base_fare: quoteData.amount || 0,
      total_fare: quoteData.total_ttc || quoteData.amount || 0,
      total_distance: quoteData.distance_km || 0,
      outbound_duration_minutes: quoteData.duration_minutes || 0,
      include_return: quoteData.has_return_trip || false,
      waiting_time_minutes: quoteData.waiting_time_minutes || 0,
      waiting_fare: quoteData.waiting_time_price || 0,
      night_surcharge: quoteData.night_surcharge || 0,
      sunday_surcharge: quoteData.sunday_holiday_surcharge || 0,
      holiday_surcharge: 0,
      vehicle_type_id: quoteData.vehicle_id,
      amount_ht: quoteData.amount_ht || 0,
      total_ttc: quoteData.total_ttc || 0
    };
      
    const { data, error } = await supabase
      .from('quotes')
      .insert(quotePrepared)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
    
    // Transformer les données brutes en type Quote
    const quote: Quote = {
      id: data.id,
      driver_id: data.driver_id,
      client_id: clientId,
      vehicle_id: data.vehicle_type_id,
      ride_date: data.departure_datetime,
      amount: data.total_fare,
      departure_location: quoteData.departure_location,
      arrival_location: quoteData.arrival_location,
      status: validateQuoteStatus(quoteData.status || 'pending'),
      quote_pdf: null,
      created_at: data.created_at,
      updated_at: data.created_at,
      distance_km: data.total_distance,
      duration_minutes: data.outbound_duration_minutes,
      has_return_trip: data.include_return,
      has_waiting_time: !!data.waiting_time_minutes,
      waiting_time_minutes: data.waiting_time_minutes,
      waiting_time_price: data.waiting_fare,
      night_surcharge: data.night_surcharge,
      sunday_holiday_surcharge: data.sunday_surcharge,
      amount_ht: data.amount_ht,
      total_ttc: data.total_ttc
    };
    
    console.log("Quote created successfully:", quote);
    return quote;
  }
};
