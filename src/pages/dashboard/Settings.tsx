
import React from 'react';
import { Settings2, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import VehicleTypesManager from '@/components/settings/vehicle-types/VehicleTypesManager';
import CompanySettingsManager from '@/components/settings/company/CompanySettingsManager';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Personnalisez vos devis et gérez vos informations
          </p>
        </div>
        
        <Tabs defaultValue="vehicle-types">
          <TabsList>
            <TabsTrigger value="vehicle-types">Types de véhicules</TabsTrigger>
            <TabsTrigger value="company">Configuration de l'entreprise</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicle-types" className="space-y-4 mt-4">
            <VehicleTypesManager />
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4 mt-4">
            <CompanySettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
