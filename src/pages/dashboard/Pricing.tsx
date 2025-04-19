
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
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePricing, DistanceTier } from '@/hooks/use-pricing';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Vehicle } from '@/types/vehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import pricing component fragments
import DistanceTiersList from '@/components/pricing/DistanceTiersList';
import DistanceTierDialog from '@/components/pricing/DistanceTierDialog';
import VehicleNightRatesForm from '@/components/pricing/VehicleNightRatesForm';
import VehicleWaitingRatesForm from '@/components/pricing/VehicleWaitingRatesForm';
import VehicleAdditionalOptionsForm from '@/components/pricing/VehicleAdditionalOptionsForm';
import { AlertCircle } from 'lucide-react';

const Pricing = () => {
  const { user } = useAuth();
  const {
    loading,
    savingSettings,
    pricingSettings,
    distanceTiers,
    error,
    saveSettings,
    saveTier,
    deleteTier,
    refreshData,
    setSavingSettings
  } = usePricing();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingTier, setEditingTier] = useState<DistanceTier | null>(null);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("distance");

  // Load vehicles data
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicles = async () => {
      try {
        console.log("Fetching vehicles for user:", user.id);
        // Fetch vehicles
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('driver_id', user.id)
          .order('name', { ascending: true });
          
        if (vehiclesError) throw vehiclesError;
        console.log("Vehicles data received:", vehiclesData);
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
  }, [user]);
  
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
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicleId(value);
    // Reset to the default tab when changing vehicles
    setActiveTab("distance");
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des tarifs</h1>
            <p className="text-muted-foreground">
              Définissez vos tarifs pour vos services
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Actualiser
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                className="ml-2"
              >
                Actualiser les données
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {!pricingSettings && !loading && !error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Données manquantes</AlertTitle>
            <AlertDescription>
              Aucune donnée de tarification trouvée. Veuillez actualiser la page.
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                className="ml-2"
              >
                Actualiser les données
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configuration des tarifs</CardTitle>
            <CardDescription>
              Définissez vos différents tarifs et options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="distance">Tarifs au km</TabsTrigger>
                <TabsTrigger value="night">Tarifs de nuit</TabsTrigger>
                <TabsTrigger value="waiting">Tarifs d'attente</TabsTrigger>
                <TabsTrigger value="additional">Options supplémentaires</TabsTrigger>
              </TabsList>
              
              {/* Distance-based rates */}
              <TabsContent value="distance" className="space-y-4 mt-4">
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Les tarifs au kilomètre peuvent être définis individuellement pour chaque véhicule.
                  </AlertDescription>
                </Alert>
                <DistanceTiersList
                  vehicles={vehicles}
                  distanceTiers={distanceTiers}
                  selectedVehicleId={selectedVehicleId}
                  onAddTier={openAddTierDialog}
                  onEditTier={openEditTierDialog}
                  onDeleteTier={handleDeleteTier}
                  onVehicleSelect={handleVehicleChange}
                />
              </TabsContent>
              
              {/* Night rates - global settings */}
              <TabsContent value="night" className="space-y-4 mt-4">
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Les tarifs de nuit s'appliquent à tous les véhicules.
                  </AlertDescription>
                </Alert>
                <VehicleNightRatesForm
                  settings={pricingSettings}
                  onSave={saveSettings}
                  saving={savingSettings}
                />
              </TabsContent>
              
              {/* Waiting rates - global settings */}
              <TabsContent value="waiting" className="space-y-4 mt-4">
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Les tarifs d'attente s'appliquent à tous les véhicules.
                  </AlertDescription>
                </Alert>
                <VehicleWaitingRatesForm
                  settings={pricingSettings}
                  onSave={saveSettings}
                  saving={savingSettings}
                />
              </TabsContent>
              
              {/* Additional options - global settings */}
              <TabsContent value="additional" className="space-y-4 mt-4">
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Ces options s'appliquent à tous les véhicules.
                  </AlertDescription>
                </Alert>
                <VehicleAdditionalOptionsForm
                  settings={pricingSettings}
                  onSave={saveSettings}
                  saving={savingSettings}
                />
              </TabsContent>
            </Tabs>
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
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
