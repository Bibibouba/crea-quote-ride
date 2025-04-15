
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Tarif simple et transparent
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Choisissez l'offre qui correspond à vos besoins de chauffeur VTC
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Plan Essentiel */}
          <div className="rounded-xl border bg-background shadow-lg p-8">
            <h3 className="text-2xl font-bold">Essentiel</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              9,99€<span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Idéal pour les chauffeurs individuels
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Jusqu'à 3 véhicules",
                "50 devis par mois",
                "Module de devis intégrable",
                "Calcul avec Google Maps API",
                "Génération de devis PDF",
                "Signature électronique",
                "Support email"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 shrink-0 text-secondary" />
                  <span className="ml-2 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button size="lg" className="w-full mt-8" asChild>
              <Link to="/inscription">Commencer l'essai gratuit</Link>
            </Button>
            
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Essai gratuit de 14 jours, sans carte bancaire
            </p>
          </div>
          
          {/* Plan Professionnel */}
          <div className="rounded-xl border bg-background shadow-lg p-8 relative">
            <div className="absolute -right-2 top-4 rotate-0 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-l-md">
              Populaire
            </div>
            <h3 className="text-2xl font-bold">Professionnel</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              19,99€<span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Pour les petites entreprises (2-9 chauffeurs)
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Jusqu'à 10 véhicules",
                "Devis illimités",
                "Module de devis intégrable",
                "Calcul avec Google Maps API",
                "Génération de devis PDF",
                "Signature électronique",
                "Support email et téléphone",
                "Personnalisation complète"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 shrink-0 text-secondary" />
                  <span className="ml-2 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <p className="mt-4 text-xs text-muted-foreground text-center">
              5€ HT par chauffeur supplémentaire
            </p>
            
            <Button size="lg" className="w-full mt-6" asChild variant="default">
              <Link to="/inscription">Commencer l'essai gratuit</Link>
            </Button>
            
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Essai gratuit de 14 jours, sans carte bancaire
            </p>
          </div>
          
          {/* Plan Entreprise */}
          <div className="rounded-xl border bg-background shadow-lg p-8">
            <h3 className="text-2xl font-bold">Entreprise</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              49,99€<span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Pour les sociétés de transport (10+ chauffeurs)
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Véhicules illimités",
                "Devis illimités",
                "Module de devis intégrable",
                "Calcul avec Google Maps API",
                "Génération de devis PDF",
                "Signature électronique",
                "Support prioritaire 24/7",
                "Personnalisation complète",
                "Facturation automatique",
                "API pour intégrations tierces"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 shrink-0 text-secondary" />
                  <span className="ml-2 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <p className="mt-4 text-xs text-muted-foreground text-center">
              5€ HT par chauffeur supplémentaire
            </p>
            
            <Button size="lg" className="w-full mt-6" asChild>
              <Link to="/inscription">Commencer l'essai gratuit</Link>
            </Button>
            
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Essai gratuit de 14 jours, sans carte bancaire
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
