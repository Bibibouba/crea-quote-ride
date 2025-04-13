
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanySettingsManager from '@/components/settings/company/CompanySettingsManager';
import VehicleTypesManager from '@/components/settings/vehicle-types/VehicleTypesManager';
import { Car, PaintBucket } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('company');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos paramètres d'entreprise et vos préférences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <PaintBucket className="h-4 w-4" />
            <span>Entreprise</span>
          </TabsTrigger>
          <TabsTrigger value="vehicle-types" className="flex items-center space-x-2">
            <Car className="h-4 w-4" />
            <span>Types de véhicules</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettingsManager />
        </TabsContent>

        <TabsContent value="vehicle-types">
          <VehicleTypesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
