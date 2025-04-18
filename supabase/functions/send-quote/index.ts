
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Resend } from 'npm:resend@1.0.0'
import { renderAsync } from 'npm:@react-email/render@0.0.7'
import { QuoteEmail } from './email-template.tsx'
import { format } from 'npm:date-fns@2.30.0'
import { fr } from 'npm:date-fns@2.30.0/locale'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuoteEmailRequest {
  clientName: string
  clientEmail: string
  quoteId: string
  departureLocation: string
  arrivalLocation: string
  rideDate: string
  amount: number
  pdfUrl?: string
}

serve(async (req) => {
  // Gérer la requête OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request to send-quote function')
    const requestData = await req.json()
    console.log('Request data:', JSON.stringify(requestData))
    
    const {
      clientName,
      clientEmail,
      quoteId,
      departureLocation,
      arrivalLocation,
      rideDate,
      amount,
      pdfUrl,
    }: QuoteEmailRequest = requestData

    console.log('Sending email to:', clientEmail)
    
    // Formatter la date
    const formattedDate = format(new Date(rideDate), 'dd MMMM yyyy à HH:mm', { locale: fr })

    // Générer le HTML du mail
    const html = await renderAsync(
      QuoteEmail({
        clientName,
        quoteId,
        departureLocation,
        arrivalLocation,
        rideDate: formattedDate,
        amount,
        pdfUrl,
      })
    )

    console.log('Email HTML generated successfully')
    
    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'VTC <onboarding@resend.dev>',
      to: [clientEmail],
      subject: `Votre devis VTC N° ${quoteId}`,
      html,
    })

    console.log('Resend email response:', data)
    
    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-quote function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
