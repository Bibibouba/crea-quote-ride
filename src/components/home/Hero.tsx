
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="relative py-20 hero-gradient overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-1 gap-12 items-center">
          <div className="flex flex-col gap-6 animate-fade-in mx-auto text-center max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Devis instantanés pour <span className="gradient-text">chauffeurs VTC</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Intégrez un module de devis instantané sur votre site web, calculez des tarifs précis et envoyez des devis professionnels à vos clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:items-start justify-center">
              <Button size="lg" asChild>
                <Link to="/inscription">
                  Commencer l'essai gratuit
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => {
                  const element = document.getElementById('features');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Voir les fonctionnalités
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
