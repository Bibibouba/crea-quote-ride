
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Resend } from 'npm:resend@1.0.0'
import { renderAsync } from 'npm:@react-email/render@0.0.7'
import { QuoteEmail } from './email-template.tsx'
import { format } from 'npm:date-fns@2.30.0'
import { fr } from 'npm:date-fns@2.30.0/locale/fr'

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
    
    // Vérifier la présence de l'API key de Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('Clé API Resend non configurée')
      throw new Error('Configuration Resend manquante - La variable d\'environnement RESEND_API_KEY n\'est pas définie')
    } else {
      console.log('Clé API Resend trouvée:', resendApiKey.substring(0, 5) + '...')
    }
    
    // Récupérer les données de la requête
    const requestData = await req.json()
    console.log('Données reçues:', JSON.stringify(requestData, null, 2))
    
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
    
    // Valider les autres champs requis
    if (!clientName || clientName.trim() === '') {
      console.error('Nom du client manquant')
      throw new Error('Nom du client requis')
    }
    
    if (!departureLocation || !arrivalLocation) {
      console.error('Adresses de départ ou d\'arrivée manquantes')
      throw new Error('Adresses de départ et d\'arrivée requises')
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

    // Créer le texte brut comme alternative
    const plainText = `Bonjour ${clientName},
    
Votre devis VTC N° ${quoteId} a été généré avec succès.

Détails du trajet :
- Départ : ${departureLocation}
- Arrivée : ${arrivalLocation}
- Date : ${formattedDate}
- Montant total : ${amount.toFixed(2)}€

Ce devis est valable 7 jours à compter de sa date d'émission. Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe VTC`

    console.log('HTML généré, préparation de l\'envoi avec Resend...')
    
    // Initialiser Resend avec la clé API
    const resend = new Resend(resendApiKey)
    
    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'VTC <onboarding@resend.dev>',
      to: [clientEmail],
      subject: `Votre devis VTC N° ${quoteId}`,
      html,
      text: plainText,
    })

    if (error) {
      console.error('Erreur Resend:', error)
      throw error
    }
    
    console.log('Réponse de Resend:', data)

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
