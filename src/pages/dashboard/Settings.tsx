
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import VehicleTypesManager from '@/components/settings/vehicle-types/VehicleTypesManager';
import CompanySettingsManager from '@/components/settings/company/CompanySettingsManager';
import WidgetSettings from '@/components/settings/widget/WidgetSettings';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>('vehicle-types');
  
  useEffect(() => {
    if (tabParam && ['vehicle-types', 'company', 'widget'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Personnalisez vos devis et gérez vos informations
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="vehicle-types">Types de véhicules</TabsTrigger>
            <TabsTrigger value="company">Configuration de l'entreprise</TabsTrigger>
            <TabsTrigger value="widget">Widget pour site web</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicle-types" className="space-y-4 mt-4">
            <VehicleTypesManager />
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4 mt-4">
            <CompanySettingsManager />
          </TabsContent>
          
          <TabsContent value="widget" className="space-y-4 mt-4">
            <WidgetSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
