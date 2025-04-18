
import React from 'react';
import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Responsable de traitement</h2>
            <p className="text-muted-foreground">
              VTCZen SAS, 45 rue de la République, 75002 Paris – rgpd@vtczen.fr
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Données collectées</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Identification : nom, prénom, adresse e‑mail, téléphone.</li>
              <li>Données de trajet : adresses de prise en charge et de destination, dates et heures.</li>
              <li>Données de paiement (via prestataire sécurisé).</li>
              <li>Données de connexion : adresse IP, cookies, logs.</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Finalités</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Gestion des réservations et relation client.</li>
              <li>Facturation et suivi comptable.</li>
              <li>Amélioration du service (statistiques, expérience utilisateur).</li>
              <li>Envoi d'informations et d'offres commerciales (avec consentement).</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Durée de conservation</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Données de facturation : 10 ans (conformément au Code de commerce).</li>
              <li>Données de réservation et accès : 3 ans.</li>
              <li>Cookies : jusqu'à 13 mois ou jusqu'au retrait du consentement.</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Partage et sous‑traitance</h2>
            <p className="text-muted-foreground">
              Vos données peuvent être transmises à nos prestataires (hébergement, paiement, support). 
              Ils sont liés par un contrat de confidentialité.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Sécurité</h2>
            <p className="text-muted-foreground">
              Mesures techniques (SSL, pare‑feu) et organisationnelles pour prévenir toute perte, 
              altération ou accès non autorisé.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Droits des personnes</h2>
            <p className="text-muted-foreground">Conformément au RGPD, vous disposez :</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité.</li>
              <li>d'un droit d'opposition et de retrait du consentement à tout moment.</li>
              <li>d'un droit de définir des directives post‑mortem.</li>
            </ul>
            <p className="text-muted-foreground">
              Vous pouvez exercer ces droits en contactant rgpd@vtczen.fr ou par courrier à l'adresse du siège social.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Utilisation des cookies</h2>
            <p className="text-muted-foreground">
              L'utilisateur est informé et peut accepter ou refuser les cookies via un bandeau d'information. 
              Les cookies sont utilisés pour : fonctionnement du site, analytics et marketing (avec consentement).
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
