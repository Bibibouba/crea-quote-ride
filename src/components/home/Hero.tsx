
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 hero-gradient overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Devis instantanés pour <span className="gradient-text">chauffeurs VTC</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Intégrez un module de devis instantané sur votre site web, calculez des tarifs précis et envoyez des devis professionnels à vos clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:items-start">
              <Button size="lg" asChild>
                <Link to="/inscription">
                  Commencer l'essai gratuit
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/demo">Voir la démo</Link>
              </Button>
            </div>
          </div>
          <div className="relative lg:ml-auto">
            <div className="relative lg:ml-auto animate-slide-in">
              <div className="relative mx-auto border rounded-xl overflow-hidden bg-background shadow-xl">
                <div className="py-1 px-2 bg-muted border-b flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs text-muted-foreground">
                    Module de devis VTC
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Départ</p>
                      <div className="h-10 w-full rounded border px-3 py-2 text-sm bg-gray-50">
                        15 Rue de Rivoli, Paris
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Destination</p>
                      <div className="h-10 w-full rounded border px-3 py-2 text-sm bg-gray-50">
                        Aéroport Charles de Gaulle, Paris
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-medium">Date</p>
                        <div className="h-10 w-full rounded border px-3 py-2 text-sm bg-gray-50">
                          23/04/2025
                        </div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-medium">Heure</p>
                        <div className="h-10 w-full rounded border px-3 py-2 text-sm bg-gray-50">
                          14:30
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="w-full rounded-md bg-primary text-white py-2 text-center text-sm font-medium">
                        Obtenir un devis
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
