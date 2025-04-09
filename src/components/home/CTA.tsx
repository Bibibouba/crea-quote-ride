
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section id="cta" className="py-20 hero-gradient">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Prêt à transformer votre façon de gérer vos devis VTC?
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Commencez votre essai gratuit dès aujourd'hui et découvrez tous les avantages de VTCZen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" asChild>
              <Link to="/inscription">
                Commencer l'essai gratuit
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
