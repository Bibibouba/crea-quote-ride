
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVehicles } from '@/hooks/useVehicles';
import { usePricing } from '@/hooks/use-pricing';
import PricingForm from '@/components/pricing/PricingForm';
import AdditionalOptionsForm from '@/components/pricing/AdditionalOptionsForm';
import DistanceTiersList from '@/components/pricing/DistanceTiersList';
import NightRatesForm from '@/components/pricing/NightRatesForm';
import WaitingRatesForm from '@/components/pricing/WaitingRatesForm';
import { CalendarClock, Hourglass, Landmark, Moon, Ruler } from 'lucide-react';

// Wrapper component for TabsContent
const TabWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="space-y-6">{children}</div>
);

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState<string>('base');
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { pricingSettings, distanceTiers, isLoading: pricingLoading } = usePricing();

  useEffect(() => {
    // Auto-switch to distance tab when base pricing is ready
    if (pricingSettings && activeTab === 'base') {
      const hasBasePricing = pricingSettings.base_fare > 0;
      if (hasBasePricing && distanceTiers.length === 0) {
        setActiveTab('distance');
      }
    }
  }, [pricingSettings, distanceTiers, activeTab]);

  if (vehiclesLoading || pricingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement des paramètres de tarification...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration des tarifs</h1>
        <p className="text-muted-foreground">
          Définissez votre grille tarifaire et options supplémentaires
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="base" className="flex items-center space-x-2">
            <Landmark className="h-4 w-4" />
            <span>Base tarifaire</span>
          </TabsTrigger>
          <TabsTrigger value="distance" className="flex items-center space-x-2">
            <Ruler className="h-4 w-4" />
            <span>Prix au kilomètre</span>
          </TabsTrigger>
          <TabsTrigger value="nights" className="flex items-center space-x-2">
            <Moon className="h-4 w-4" />
            <span>Tarifs de nuit</span>
          </TabsTrigger>
          <TabsTrigger value="waiting" className="flex items-center space-x-2">
            <Hourglass className="h-4 w-4" />
            <span>Temps d'attente</span>
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center space-x-2">
            <CalendarClock className="h-4 w-4" />
            <span>Options</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="base" className="space-y-6">
          <TabWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Tarification de base</CardTitle>
                <CardDescription>
                  Définissez vos prix fixes et minimums pour les courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PricingForm />
              </CardContent>
            </Card>
          </TabWrapper>
        </TabsContent>

        <TabsContent value="distance" className="space-y-6">
          <TabWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Tarifs kilométriques</CardTitle>
                <CardDescription>
                  Définissez vos tarifs par kilomètre selon la distance parcourue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DistanceTiersList vehicles={vehicles} />
              </CardContent>
            </Card>
          </TabWrapper>
        </TabsContent>

        <TabsContent value="nights" className="space-y-6">
          <TabWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Tarifs de nuit</CardTitle>
                <CardDescription>
                  Définissez un supplément pour les courses effectuées la nuit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NightRatesForm />
              </CardContent>
            </Card>
          </TabWrapper>
        </TabsContent>

        <TabsContent value="waiting" className="space-y-6">
          <TabWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Tarifs d'attente</CardTitle>
                <CardDescription>
                  Définissez les tarifs pour le temps d'attente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WaitingRatesForm />
              </CardContent>
            </Card>
          </TabWrapper>
        </TabsContent>

        <TabsContent value="options" className="space-y-6">
          <TabWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Options supplémentaires</CardTitle>
                <CardDescription>
                  Configurez les options additionnelles pour les courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdditionalOptionsForm />
              </CardContent>
            </Card>
          </TabWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingPage;
