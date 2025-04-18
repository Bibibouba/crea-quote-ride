
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
  // Tracer l'heure de début pour calculer la durée d'exécution
  const startTime = Date.now();
  console.log(`🚀 Fonction send-quote démarrée le ${new Date().toISOString()}`);
  
  // Gérer la requête OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    console.log('Requête OPTIONS reçue, retour des en-têtes CORS');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérifier la présence de l'API key de Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ ERREUR CRITIQUE: Clé API Resend non configurée');
      throw new Error('Configuration Resend manquante - La variable d\'environnement RESEND_API_KEY n\'est pas définie');
    } else {
      // Vérifier la validité basique de la clé (format attendu)
      if (!resendApiKey.startsWith('re_') || resendApiKey.length < 20) {
        console.error('⚠️ AVERTISSEMENT: Format de clé API Resend suspect:', 
                     `commence par "${resendApiKey.substring(0, 3)}", longueur: ${resendApiKey.length}`);
      } else {
        console.log('✅ Clé API Resend trouvée et au format attendu (re_...)');
      }
    }
    
    // Récupérer les données de la requête
    console.log('📥 Réception de la requête JSON...');
    const requestData = await req.json();
    console.log('📋 Données reçues:', JSON.stringify(requestData, null, 2));
    
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
    }: QuoteEmailRequest = requestData;

    // Validation des données
    console.log('🔍 Validation des données...');
    
    // Valider l'adresse email
    if (!clientEmail || !clientEmail.includes('@')) {
      console.error('❌ Adresse email invalide:', clientEmail);
      throw new Error('Adresse email invalide');
    }
    
    // Valider les autres champs requis
    if (!clientName || clientName.trim() === '') {
      console.error('❌ Nom du client manquant');
      throw new Error('Nom du client requis');
    }
    
    if (!departureLocation || !arrivalLocation) {
      console.error('❌ Adresses de départ ou d\'arrivée manquantes');
      throw new Error('Adresses de départ et d\'arrivée requises');
    }
    
    if (!quoteId) {
      console.error('❌ ID du devis manquant');
      throw new Error('ID du devis requis');
    }
    
    console.log(`✅ Validation réussie, préparation de l'email pour: ${clientEmail}`);
    
    // Formatter la date
    let formattedDate;
    try {
      formattedDate = format(new Date(rideDate), 'dd MMMM yyyy à HH:mm', { locale: fr });
      console.log(`📅 Date formatée: ${formattedDate}`);
    } catch (error) {
      console.error('⚠️ Erreur de formatage de date:', error);
      formattedDate = rideDate; // Fallback au format original
      console.log(`⚠️ Utilisation du format de date original: ${formattedDate}`);
    }

    // Générer le HTML du mail
    console.log('🔨 Génération du template HTML...');
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
    );
    console.log('✅ HTML généré avec succès');

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
L'équipe VTC`;
    
    console.log('🚀 Initialisation de Resend avec la clé API...');
    
    // Initialiser Resend avec la clé API
    const resend = new Resend(resendApiKey);
    
    console.log('📧 Envoi de l\'email via Resend...');
    console.log('Destinataire:', clientEmail);
    console.log('Sujet:', `Votre devis VTC N° ${quoteId}`);
    
    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'VTC <onboarding@resend.dev>',
      to: [clientEmail],
      subject: `Votre devis VTC N° ${quoteId}`,
      html,
      text: plainText,
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      throw error;
    }
    
    console.log('✅ Réponse de Resend (succès):', data);
    const duration = Date.now() - startTime;
    console.log(`⏱️ Fonction send-quote terminée en ${duration}ms`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email envoyé avec succès',
      data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Erreur dans la fonction send-quote après ${duration}ms:`, error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})
