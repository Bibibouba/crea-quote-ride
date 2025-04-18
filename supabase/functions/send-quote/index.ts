
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Resend } from 'npm:resend@1.0.0'
import { renderAsync } from 'npm:@react-email/render@0.0.7'
import { QuoteEmail } from './email-template.tsx'
import { format } from 'npm:date-fns@2.30.0'
import { fr } from 'npm:date-fns@2.30.0/locale/fr'

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
    console.log('Fonction send-quote démarrée')
    
    // Récupérer les données de la requête
    const requestData = await req.json()
    console.log('Données reçues:', JSON.stringify(requestData))
    
    // Vérifier la présence de l'API key de Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('Clé API Resend non configurée')
      throw new Error('Configuration Resend manquante')
    }
    
    // Extraire les champs nécessaires
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

    // Valider l'adresse email
    if (!clientEmail || !clientEmail.includes('@')) {
      console.error('Adresse email invalide:', clientEmail)
      throw new Error('Adresse email invalide')
    }
    
    console.log('Envoi d\'email à:', clientEmail)
    
    // Formatter la date
    let formattedDate
    try {
      formattedDate = format(new Date(rideDate), 'dd MMMM yyyy à HH:mm', { locale: fr })
    } catch (error) {
      console.error('Erreur de formatage de date:', error)
      formattedDate = rideDate // Fallback au format original
    }

    // Générer le HTML du mail
    console.log('Génération du template HTML...')
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

    console.log('HTML généré, préparation de l\'envoi...')
    
    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'VTC <onboarding@resend.dev>',
      to: [clientEmail],
      subject: `Votre devis VTC N° ${quoteId}`,
      html,
      text: `Bonjour ${clientName}, votre devis VTC N° ${quoteId} a été généré. Trajet de ${departureLocation} à ${arrivalLocation} prévu le ${formattedDate} pour un montant de ${amount.toFixed(2)}€.`,
    })

    console.log('Réponse de Resend:', data)
    
    if (error) {
      console.error('Erreur Resend:', error)
      throw error
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email envoyé avec succès',
      data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Erreur dans la fonction send-quote:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
