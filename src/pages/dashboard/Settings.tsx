
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanySettingsManager } from '@/components/settings/company/CompanySettingsManager';
import { VehicleTypesManager } from '@/components/settings/vehicle-types/VehicleTypesManager';
import { Building, Cars } from 'lucide-react';

// Wrapper component to fix type issues
const TabWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="space-y-6">{children}</div>
);

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez vos paramètres généraux et d'entreprise
        </p>
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Entreprise</span>
          </TabsTrigger>
          <TabsTrigger value="vehicle-types" className="flex items-center gap-2">
            <Cars className="h-4 w-4" />
            <span>Types de véhicules</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="company" className="mt-6">
          <TabWrapper>
            <CompanySettingsManager />
          </TabWrapper>
        </TabsContent>
        <TabsContent value="vehicle-types" className="mt-6">
          <TabWrapper>
            <VehicleTypesManager />
          </TabWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
