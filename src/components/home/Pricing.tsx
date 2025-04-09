
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Tarif simple et transparent
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Tout ce dont vous avez besoin pour gérer vos devis et factures en tant que chauffeur VTC
          </p>
        </div>
        
        <div className="mx-auto max-w-md mt-12">
          <div className="rounded-xl border bg-background shadow-lg p-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Formule Complète</h3>
              <div className="rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
                Populaire
              </div>
            </div>
            <div className="mt-4 flex items-baseline text-6xl font-extrabold">
              9,99€<span className="ml-1 text-2xl font-medium text-muted-foreground">/mois</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Sans engagement, payable mensuellement
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                "Module de devis intégrable sur votre site",
                "Calcul précis avec Google Maps Matrix API",
                "Gestion de plusieurs véhicules",
                "Tarifs d'attente personnalisables",
                "Génération de devis PDF professionnels",
                "Création de factures à partir des devis",
                "Signature électronique des devis",
                "Personnalisation avec votre logo",
                "Notifications par email",
                "Accès à un tableau de bord complet"
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
        </div>
      </div>
    </section>
  );
};

export default Pricing;
