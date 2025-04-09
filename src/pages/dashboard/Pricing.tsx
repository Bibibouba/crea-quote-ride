
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CircleDollarSign,
  Loader2,
  Clock,
  Moon,
  PlusCircle,
  Trash2,
  PercentIcon,
  Edit,
  Save,
  Car
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Types
interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  is_luxury: boolean;
  vehicle_type_name: string;
}

interface PricingSettings {
  id: string;
  base_fare: number;
  price_per_km: number;
  waiting_fee_per_minute: number;
  min_fare: number;
  night_rate_enabled: boolean | null;
  night_rate_start: string | null;
  night_rate_end: string | null;
  night_rate_percentage: number | null;
  wait_price_per_15min: number | null;
  wait_night_enabled: boolean | null;
  wait_night_start: string | null;
  wait_night_end: string | null;
  wait_night_percentage: number | null;
  minimum_trip_fare: number | null;
  holiday_sunday_percentage: number | null;
  minimum_trip_minutes: number | null;
  service_area: string | null;
}

interface DistanceTier {
  id?: string;
  min_km: number;
  max_km: number | null;
  price_per_km: number;
  vehicle_id: string | null;
}

// Form schemas
const pricingFormSchema = z.object({
  base_fare: z.coerce.number().min(0, "Le tarif de base doit être positif"),
  min_fare: z.coerce.number().min(0, "Le tarif minimum doit être positif"),
  waiting_fee_per_minute: z.coerce.number().min(0, "Le tarif d'attente doit être positif"),
  price_per_km: z.coerce.number().min(0, "Le tarif par km doit être positif"),
  night_rate_enabled: z.boolean().default(false),
  night_rate_start: z.string().optional().nullable(),
  night_rate_end: z.string().optional().nullable(),
  night_rate_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
  wait_price_per_15min: z.coerce.number().min(0, "Le tarif d'attente doit être positif"),
  wait_night_enabled: z.boolean().default(false),
  wait_night_start: z.string().optional().nullable(),
  wait_night_end: z.string().optional().nullable(),
  wait_night_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
  minimum_trip_fare: z.coerce.number().min(0, "Le tarif minimum doit être positif"),
  holiday_sunday_percentage: z.coerce.number().min(0, "Le pourcentage doit être positif"),
  minimum_trip_minutes: z.coerce.number().min(0, "La durée minimum doit être positive"),
  service_area: z.string().optional().nullable(),
});

const distanceTierSchema = z.object({
  min_km: z.coerce.number().min(0, "La distance minimale doit être positive"),
  max_km: z.coerce.number().nullable().optional(),
  price_per_km: z.coerce.number().min(0, "Le tarif par km doit être positif"),
  vehicle_id: z.string().nullable().optional(),
});

const Pricing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [distanceTiers, setDistanceTiers] = useState<DistanceTier[]>([]);
  const [editingTier, setEditingTier] = useState<DistanceTier | null>(null);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  // Initialize forms
  const pricingForm = useForm<z.infer<typeof pricingFormSchema>>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      base_fare: 50,
      min_fare: 70,
      waiting_fee_per_minute: 0.5,
      price_per_km: 1.75,
      night_rate_enabled: false,
      night_rate_start: "20:00",
      night_rate_end: "06:00",
      night_rate_percentage: 15,
      wait_price_per_15min: 7.5,
      wait_night_enabled: false,
      wait_night_start: "20:00",
      wait_night_end: "06:00",
      wait_night_percentage: 15,
      minimum_trip_fare: 0,
      holiday_sunday_percentage: 15,
      minimum_trip_minutes: 0,
      service_area: "",
    },
  });

  const tierForm = useForm<z.infer<typeof distanceTierSchema>>({
    resolver: zodResolver(distanceTierSchema),
    defaultValues: {
      min_km: 0,
      max_km: 200,
      price_per_km: 1.75,
      vehicle_id: null,
    },
  });

  // Load data
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch pricing settings
        const { data: pricingData, error: pricingError } = await supabase
          .from('pricing')
          .select('*')
          .limit(1);
          
        if (pricingError) throw pricingError;
        
        if (pricingData && pricingData.length > 0) {
          setPricingSettings(pricingData[0] as PricingSettings);
          pricingForm.reset({
            base_fare: pricingData[0].base_fare,
            min_fare: pricingData[0].min_fare,
            waiting_fee_per_minute: pricingData[0].waiting_fee_per_minute,
            price_per_km: pricingData[0].price_per_km,
            night_rate_enabled: pricingData[0].night_rate_enabled || false,
            night_rate_start: pricingData[0].night_rate_start || "20:00",
            night_rate_end: pricingData[0].night_rate_end || "06:00",
            night_rate_percentage: pricingData[0].night_rate_percentage || 15,
            wait_price_per_15min: pricingData[0].wait_price_per_15min || 7.5,
            wait_night_enabled: pricingData[0].wait_night_enabled || false,
            wait_night_start: pricingData[0].wait_night_start || "20:00",
            wait_night_end: pricingData[0].wait_night_end || "06:00",
            wait_night_percentage: pricingData[0].wait_night_percentage || 15,
            minimum_trip_fare: pricingData[0].minimum_trip_fare || 0,
            holiday_sunday_percentage: pricingData[0].holiday_sunday_percentage || 15,
            minimum_trip_minutes: pricingData[0].minimum_trip_minutes || 0,
            service_area: pricingData[0].service_area || "",
          });
        }
        
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
        
        // Fetch distance tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from('distance_pricing_tiers')
          .select('*')
          .order('min_km', { ascending: true });
          
        if (tiersError) throw tiersError;
        setDistanceTiers(tiersData as DistanceTier[] || []);
        
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        toast.error('Erreur lors du chargement des données de tarification.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, pricingForm]);
  
  // Save general pricing settings
  const saveSettings = async (formValues: z.infer<typeof pricingFormSchema>) => {
    if (!user || !pricingSettings) return;
    
    setSavingSettings(true);
    try {
      const { error } = await supabase
        .from('pricing')
        .update({
          base_fare: formValues.base_fare,
          min_fare: formValues.min_fare,
          waiting_fee_per_minute: formValues.waiting_fee_per_minute,
          price_per_km: formValues.price_per_km,
          night_rate_enabled: formValues.night_rate_enabled,
          night_rate_start: formValues.night_rate_start,
          night_rate_end: formValues.night_rate_end,
          night_rate_percentage: formValues.night_rate_percentage,
          wait_price_per_15min: formValues.wait_price_per_15min,
          wait_night_enabled: formValues.wait_night_enabled,
          wait_night_start: formValues.wait_night_start,
          wait_night_end: formValues.wait_night_end,
          wait_night_percentage: formValues.wait_night_percentage,
          minimum_trip_fare: formValues.minimum_trip_fare,
          holiday_sunday_percentage: formValues.holiday_sunday_percentage,
          minimum_trip_minutes: formValues.minimum_trip_minutes,
          service_area: formValues.service_area,
        })
        .eq('id', pricingSettings.id);
        
      if (error) throw error;
      
      toast.success('Paramètres de tarification enregistrés avec succès.');
      
    } catch (error: any) {
      console.error('Error saving pricing settings:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSavingSettings(false);
    }
  };
  
  // Handle distance tier operations
  const openAddTierDialog = () => {
    setEditingTier(null);
    tierForm.reset({
      min_km: distanceTiers.length > 0 ? Math.max(...distanceTiers.map(t => t.max_km || 0)) + 1 : 0,
      max_km: null,
      price_per_km: 1.75,
      vehicle_id: selectedVehicleId,
    });
    setTierDialogOpen(true);
  };
  
  const openEditTierDialog = (tier: DistanceTier) => {
    setEditingTier(tier);
    tierForm.reset({
      min_km: tier.min_km,
      max_km: tier.max_km,
      price_per_km: tier.price_per_km,
      vehicle_id: tier.vehicle_id,
    });
    setTierDialogOpen(true);
  };
  
  const saveTier = async (formValues: z.infer<typeof distanceTierSchema>) => {
    if (!user) return;
    
    setSavingSettings(true);
    try {
      if (editingTier?.id) {
        // Update existing tier
        const { error } = await supabase
          .from('distance_pricing_tiers')
          .update({
            min_km: formValues.min_km,
            max_km: formValues.max_km,
            price_per_km: formValues.price_per_km,
            vehicle_id: formValues.vehicle_id,
          })
          .eq('id', editingTier.id);
          
        if (error) throw error;
        
        setDistanceTiers(prevTiers => 
          prevTiers.map(t => t.id === editingTier.id ? 
            {...t, min_km: formValues.min_km, max_km: formValues.max_km, price_per_km: formValues.price_per_km, vehicle_id: formValues.vehicle_id} : 
            t
          )
        );
        
        toast.success('Palier de tarification mis à jour.');
      } else {
        // Add new tier
        const { data, error } = await supabase
          .from('distance_pricing_tiers')
          .insert({
            driver_id: user.id,
            min_km: formValues.min_km,
            max_km: formValues.max_km,
            price_per_km: formValues.price_per_km,
            vehicle_id: formValues.vehicle_id,
          })
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setDistanceTiers(prevTiers => [...prevTiers, data[0] as DistanceTier]);
        }
        
        toast.success('Nouveau palier de tarification ajouté.');
      }
      
      setTierDialogOpen(false);
      
    } catch (error: any) {
      console.error('Error saving distance tier:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSavingSettings(false);
    }
  };
  
  const deleteTier = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce palier de tarification ?')) return;
    
    try {
      const { error } = await supabase
        .from('distance_pricing_tiers')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDistanceTiers(prevTiers => prevTiers.filter(t => t.id !== id));
      toast.success('Palier de tarification supprimé.');
      
    } catch (error: any) {
      console.error('Error deleting distance tier:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };
  
  // Filter tiers by vehicle
  const filteredTiers = selectedVehicleId ? 
    distanceTiers.filter(tier => tier.vehicle_id === selectedVehicleId || tier.vehicle_id === null) : 
    distanceTiers;
  
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
                {vehicles.length === 0 ? (
                  <div className="text-center py-6">
                    <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ajoutez d'abord un véhicule</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous devez créer au moins un véhicule avant de pouvoir définir vos tarifs.
                    </p>
                    <Button asChild>
                      <a href="/dashboard/vehicles">Ajouter un véhicule</a>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicles.map((vehicle) => (
                        <Button
                          key={vehicle.id}
                          variant={selectedVehicleId === vehicle.id ? "default" : "outline"}
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                        >
                          <Car className="mr-2 h-4 w-4" />
                          {vehicle.name}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium bg-muted">
                        <div>De (km)</div>
                        <div>À (km)</div>
                        <div>Prix par km</div>
                        <div></div>
                      </div>
                      <Separator />
                      
                      {filteredTiers.length === 0 ? (
                        <div className="p-8 text-center">
                          <p className="text-sm text-muted-foreground mb-4">
                            Aucun palier de tarification défini pour ce véhicule.
                          </p>
                        </div>
                      ) : (
                        filteredTiers
                          .sort((a, b) => a.min_km - b.min_km)
                          .map((tier) => (
                            <div key={tier.id} className="grid grid-cols-4 p-4 items-center">
                              <div>{tier.min_km} km</div>
                              <div>{tier.max_km ? `${tier.max_km} km` : 'Illimité'}</div>
                              <div>{tier.price_per_km.toFixed(2)} €/km</div>
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditTierDialog(tier)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => tier.id && deleteTier(tier.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button onClick={openAddTierDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un palier
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Dialog for adding/editing tiers */}
            <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTier ? "Modifier le palier" : "Ajouter un palier de tarification"}
                  </DialogTitle>
                  <DialogDescription>
                    Définissez un palier de tarification en fonction de la distance
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...tierForm}>
                  <form onSubmit={tierForm.handleSubmit(saveTier)} className="space-y-4">
                    <FormField
                      control={tierForm.control}
                      name="vehicle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Véhicule</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value || null)}
                            >
                              <option value="">Tous les véhicules</option>
                              {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormDescription>
                            Sélectionnez un véhicule spécifique ou "Tous" pour appliquer à tous
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={tierForm.control}
                        name="min_km"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distance minimum (km)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={tierForm.control}
                        name="max_km"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distance maximum (km)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Laissez vide pour illimité"
                                value={field.value === null ? '' : field.value}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                              />
                            </FormControl>
                            <FormDescription>
                              Laissez vide pour une distance illimitée
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={tierForm.control}
                      name="price_per_km"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix par kilomètre (€)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" disabled={savingSettings}>
                        {savingSettings ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                <Form {...pricingForm}>
                  <form onSubmit={pricingForm.handleSubmit(saveSettings)} className="space-y-6">
                    <FormField
                      control={pricingForm.control}
                      name="night_rate_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Activer les tarifs de nuit</FormLabel>
                            <FormDescription>
                              Appliquer une majoration aux courses effectuées pendant la nuit
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={pricingForm.control}
                        name="night_rate_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de début</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="night_rate_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de fin</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="night_rate_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pourcentage de majoration (%)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type="number" step="0.01" {...field} />
                                <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" disabled={savingSettings}>
                      {savingSettings ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
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
                <Form {...pricingForm}>
                  <form onSubmit={pricingForm.handleSubmit(saveSettings)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={pricingForm.control}
                        name="waiting_fee_per_minute"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tarif d'attente par minute (€)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                              Tarif appliqué par minute d'attente
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="wait_price_per_15min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tarif par tranche de 15 minutes (€)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                              Tout quart d'heure commencé est dû
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <FormField
                      control={pricingForm.control}
                      name="wait_night_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Tarifs d'attente de nuit</FormLabel>
                            <FormDescription>
                              Appliquer une majoration au temps d'attente pendant la nuit
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={pricingForm.control}
                        name="wait_night_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de début</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="wait_night_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heure de fin</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="wait_night_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pourcentage de majoration (%)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type="number" step="0.01" {...field} />
                                <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" disabled={savingSettings}>
                      {savingSettings ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
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
                <Form {...pricingForm}>
                  <form onSubmit={pricingForm.handleSubmit(saveSettings)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={pricingForm.control}
                        name="minimum_trip_fare"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tarif minimum par course (€)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                              Prix minimum facturé pour une course, quelle que soit la distance
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="holiday_sunday_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Majoration jours fériés et dimanche (%)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type="number" step="0.01" {...field} />
                                <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Pourcentage de majoration appliqué les dimanches et jours fériés
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={pricingForm.control}
                        name="minimum_trip_minutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temps de trajet minimum facturé (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Durée minimum facturée, même si le trajet est plus court
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pricingForm.control}
                        name="base_fare"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frais de prise en charge (€)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                              Frais fixes ajoutés au début de chaque course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={pricingForm.control}
                      name="service_area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone de service</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ex: Paris et région parisienne, Lyon et agglomération..."
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormDescription>
                            Précisez les zones où vous proposez vos services (facultatif)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={savingSettings}>
                      {savingSettings ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
