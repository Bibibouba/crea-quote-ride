
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { usePricing, DistanceTier } from '@/hooks/use-pricing';

// Import pricing component fragments
import DistanceTiersList from '@/components/pricing/DistanceTiersList';
import DistanceTierDialog from '@/components/pricing/DistanceTierDialog';
import NightRatesForm from '@/components/pricing/NightRatesForm';
import WaitingRatesForm from '@/components/pricing/WaitingRatesForm';
import AdditionalOptionsForm from '@/components/pricing/AdditionalOptionsForm';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  is_luxury: boolean;
  vehicle_type_name: string;
}

const Pricing = () => {
  const { user } = useAuth();
  const {
    loading,
    savingSettings,
    pricingSettings,
    distanceTiers,
    saveSettings,
    saveTier,
    deleteTier,
    setSavingSettings
  } = usePricing();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingTier, setEditingTier] = useState<DistanceTier | null>(null);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Load vehicles data
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicles = async () => {
      try {
        // Fetch vehicles
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .order('name', { ascending: true });
          
        if (vehiclesError) throw vehiclesError;
        setVehicles(vehiclesData as Vehicle[] || []);
        
        if (vehiclesData && vehiclesData.length > 0 && !selectedVehicleId) {
          setSelectedVehicleId(vehiclesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching vehicles data:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des véhicules.",
          variant: "destructive",
        });
      }
    };
    
    fetchVehicles();
  }, [user, selectedVehicleId]);
  
  // Handle tier dialog operations
  const openAddTierDialog = () => {
    setEditingTier(null);
    setTierDialogOpen(true);
  };
  
  const openEditTierDialog = (tier: DistanceTier) => {
    setEditingTier(tier);
    setTierDialogOpen(true);
  };
  
  const handleSaveTier = async (formValues: any) => {
    const tierData = {
      ...formValues,
      id: editingTier?.id
    };
    
    await saveTier(tierData, !editingTier);
    setTierDialogOpen(false);
  };
  
  const handleDeleteTier = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce palier de tarification ?')) return;
    await deleteTier(id);
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // Debugging
  console.log("pricingSettings:", pricingSettings);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des tarifs</h1>
          <p className="text-muted-foreground">
            Définissez vos tarifs pour chaque véhicule et type de service
          </p>
        </div>
        
        <Tabs defaultValue="distance">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:flex">
            <TabsTrigger value="distance">Tarifs au km</TabsTrigger>
            <TabsTrigger value="night">Tarifs de nuit</TabsTrigger>
            <TabsTrigger value="waiting">Tarifs d'attente</TabsTrigger>
            <TabsTrigger value="additional">Options supplémentaires</TabsTrigger>
          </TabsList>
          
          {/* Distance-based rates */}
          <TabsContent value="distance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tarifs au kilomètre par véhicule</CardTitle>
                <CardDescription>
                  Définissez des paliers de tarification dégressifs en fonction de la distance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DistanceTiersList
                  vehicles={vehicles}
                  distanceTiers={distanceTiers}
                  selectedVehicleId={selectedVehicleId}
                  onAddTier={openAddTierDialog}
                  onEditTier={openEditTierDialog}
                  onDeleteTier={handleDeleteTier}
                  onVehicleSelect={setSelectedVehicleId}
                />
              </CardContent>
            </Card>
            
            {/* Dialog for adding/editing tiers */}
            <DistanceTierDialog
              open={tierDialogOpen}
              onOpenChange={setTierDialogOpen}
              onSave={handleSaveTier}
              editingTier={editingTier}
              vehicles={vehicles}
              saving={savingSettings}
            />
          </TabsContent>
          
          {/* Night rates */}
          <TabsContent value="night" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tarifs de nuit</CardTitle>
                <CardDescription>
                  Définissez des majorations pour les courses effectuées pendant la nuit
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pricingSettings && (
                  <NightRatesForm
                    settings={pricingSettings}
                    onSave={saveSettings}
                    saving={savingSettings}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Waiting rates */}
          <TabsContent value="waiting" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tarifs d'attente</CardTitle>
                <CardDescription>
                  Définissez vos tarifs pour le temps d'attente durant les courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pricingSettings && (
                  <WaitingRatesForm
                    settings={pricingSettings}
                    onSave={saveSettings}
                    saving={savingSettings}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Additional options */}
          <TabsContent value="additional" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Options supplémentaires</CardTitle>
                <CardDescription>
                  Paramètres additionnels pour personnaliser vos tarifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pricingSettings && (
                  <AdditionalOptionsForm
                    settings={pricingSettings}
                    onSave={saveSettings}
                    saving={savingSettings}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
