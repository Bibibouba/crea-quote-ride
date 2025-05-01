
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
      vehicle_type_id: quoteData.vehicle_id
    };
      
    const { data, error } = await supabase
      .from('quotes')
      .insert(quotePrepared)
      .select();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error("No data returned from quote creation");
    }
    
    // Transformer les données brutes en type Quote
    const quote: Quote = {
      id: data[0].id,
      driver_id: data[0].driver_id,
      client_id: clientId,
      vehicle_id: data[0].vehicle_type_id,
      ride_date: data[0].departure_datetime,
      amount: data[0].total_fare,
      departure_location: quoteData.departure_location,
      arrival_location: quoteData.arrival_location,
      status: validateQuoteStatus(quoteData.status || 'pending'),
      quote_pdf: null,
      created_at: data[0].created_at,
      updated_at: data[0].created_at,
      distance_km: data[0].total_distance,
      duration_minutes: data[0].outbound_duration_minutes,
      has_return_trip: data[0].include_return,
      has_waiting_time: !!data[0].waiting_time_minutes,
      waiting_time_minutes: data[0].waiting_time_minutes,
      waiting_time_price: data[0].waiting_fare,
      night_surcharge: data[0].night_surcharge,
      sunday_holiday_surcharge: data[0].sunday_surcharge,
      amount_ht: quoteData.amount_ht,
      total_ttc: quoteData.total_ttc
    };
    
    console.log("Quote created successfully:", quote);
    return quote;
  }
};

