import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Settings2, 
  Loader2, 
  Trash2, 
  PlusCircle, 
  Pencil,
  Check,
  X,
  CarFront,
  Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Database } from '@/integrations/supabase/types';

type VehicleType = Database['public']['Tables']['vehicle_types']['Row'];
type CompanySettings = Database['public']['Tables']['company_settings']['Row'];

const vehicleTypeSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  icon: z.string().optional(),
});

const companySettingsSchema = z.object({
  logo_url: z.string().optional().nullable(),
  primary_color: z.string().optional().nullable(),
  secondary_color: z.string().optional().nullable(),
  font_family: z.string().optional().nullable(),
});

const Settings = () => {
  const { user } = useAuth();
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editingInPlace, setEditingInPlace] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState("");

  const vehicleTypeForm = useForm<z.infer<typeof vehicleTypeSchema>>({
    resolver: zodResolver(vehicleTypeSchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  const companySettingsForm = useForm<z.infer<typeof companySettingsSchema>>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      logo_url: "",
      primary_color: "#3B82F6",
      secondary_color: "#10B981",
      font_family: "Inter",
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: typesData, error: typesError } = await supabase
          .from('vehicle_types')
          .select('*')
          .order('name', { ascending: true });

        if (typesError) throw typesError;
        setVehicleTypes(typesData || []);

        const { data: settingsData, error: settingsError } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1);

        if (settingsError) throw settingsError;

        if (settingsData && settingsData.length > 0) {
          setCompanySettings(settingsData[0]);
          companySettingsForm.reset({
            logo_url: settingsData[0].logo_url,
            primary_color: settingsData[0].primary_color || "#3B82F6",
            secondary_color: settingsData[0].secondary_color || "#10B981",
            font_family: settingsData[0].font_family || "Inter",
          });
        } else {
          const { data: newSettings, error: createError } = await supabase
            .from('company_settings')
            .insert({
              driver_id: user.id,
              primary_color: "#3B82F6",
              secondary_color: "#10B981",
              font_family: "Inter",
            })
            .select();

          if (createError) throw createError;
          if (newSettings && newSettings.length > 0) {
            setCompanySettings(newSettings[0]);
          }
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, companySettingsForm]);

  const handleVehicleTypeSubmit = async (values: z.infer<typeof vehicleTypeSchema>) => {
    if (!user) return;
    
    setSaving(true);
    try {
      if (editingType) {
        const { error } = await supabase
          .from('vehicle_types')
          .update({
            name: values.name,
            icon: values.icon || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingType.id);

        if (error) throw error;
        
        setVehicleTypes(types => 
          types.map(t => t.id === editingType.id ? { ...t, name: values.name, icon: values.icon || null } : t)
        );
        
        toast.success('Type de véhicule mis à jour');
      } else {
        const { data, error } = await supabase
          .from('vehicle_types')
          .insert({
            name: values.name,
            icon: values.icon || null,
            driver_id: user.id,
            is_default: false,
          })
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          setVehicleTypes(prev => [...prev, data[0] as VehicleType]);
        }
        
        toast.success('Type de véhicule ajouté');
      }
      
      setIsTypeDialogOpen(false);
      vehicleTypeForm.reset();
      setEditingType(null);
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du type de véhicule:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce type de véhicule ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicleTypes(types => types.filter(t => t.id !== id));
      toast.success('Type de véhicule supprimé');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingInPlace(id);
    setNewTypeName(name);
  };

  const saveInlineEdit = async (id: string) => {
    if (!newTypeName.trim() || newTypeName.length < 3) {
      toast.error('Le nom doit contenir au moins 3 caractères');
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_types')
        .update({ name: newTypeName, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setVehicleTypes(types => 
        types.map(t => t.id === id ? { ...t, name: newTypeName } : t)
      );

      setEditingInPlace(null);
      toast.success('Type de véhicule mis à jour');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const cancelInlineEdit = () => {
    setEditingInPlace(null);
    setNewTypeName("");
  };

  const handleCompanySettingsSubmit = async (values: z.infer<typeof companySettingsSchema>) => {
    if (!user || !companySettings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          logo_url: values.logo_url,
          primary_color: values.primary_color,
          secondary_color: values.secondary_color,
          font_family: values.font_family,
          updated_at: new Date().toISOString(),
        })
        .eq('id', companySettings.id);

      if (error) throw error;
      
      toast.success('Paramètres d\'entreprise enregistrés');
      
      setCompanySettings({
        ...companySettings,
        logo_url: values.logo_url,
        primary_color: values.primary_color,
        secondary_color: values.secondary_color,
        font_family: values.font_family,
        updated_at: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement des paramètres:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const openAddDialog = () => {
    setEditingType(null);
    vehicleTypeForm.reset({ name: "", icon: "" });
    setIsTypeDialogOpen(true);
  };

  const openEditDialog = (type: VehicleType) => {
    setEditingType(type);
    vehicleTypeForm.reset({ 
      name: type.name, 
      icon: type.icon || "" 
    });
    setIsTypeDialogOpen(true);
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Types de véhicules</CardTitle>
                  <CardDescription>
                    Gérez les différents types de véhicules que vous proposez
                  </CardDescription>
                </div>
                <Button onClick={openAddDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un type
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 p-4 font-medium bg-muted">
                    <div>Nom</div>
                    <div>Type par défaut</div>
                    <div></div>
                  </div>
                  
                  {vehicleTypes.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground">Aucun type de véhicule défini</p>
                    </div>
                  ) : (
                    vehicleTypes.map((type) => (
                      <div key={type.id} className="grid grid-cols-3 p-4 items-center border-t">
                        <div>
                          {editingInPlace === type.id ? (
                            <div className="flex items-center space-x-2">
                              <Input 
                                value={newTypeName} 
                                onChange={(e) => setNewTypeName(e.target.value)}
                                className="h-8"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => saveInlineEdit(type.id)}
                                className="h-8 w-8"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={cancelInlineEdit}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <CarFront className="h-4 w-4 text-muted-foreground" />
                              <span>{type.name}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {type.is_default ? (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                              Par défaut
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Non</span>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          {!type.is_default && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => startEditing(type.id, type.name)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteType(type.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingType ? "Modifier le type de véhicule" : "Ajouter un type de véhicule"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingType 
                      ? "Modifiez les informations du type de véhicule ci-dessous" 
                      : "Créez un nouveau type de véhicule pour vos devis"}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...vehicleTypeForm}>
                  <form onSubmit={vehicleTypeForm.handleSubmit(handleVehicleTypeSubmit)} className="space-y-4">
                    <FormField
                      control={vehicleTypeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du type</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SUV, Mini-van..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={vehicleTypeForm.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icône (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="URL ou nom de l'icône" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>
                            Vous pouvez laisser ce champ vide pour utiliser l'icône par défaut
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          "Enregistrer"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l'entreprise</CardTitle>
                <CardDescription>
                  Personnalisez votre profil d'entreprise et les informations affichées sur vos devis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companySettingsForm}>
                  <form onSubmit={companySettingsForm.handleSubmit(handleCompanySettingsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={companySettingsForm.control}
                        name="logo_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo de l'entreprise</FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="URL de votre logo" 
                                  {...field} 
                                  value={field.value || ''}
                                />
                                <Button type="button" variant="outline" disabled>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Importer
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Entrez l'URL de votre logo ou importez une image (fonctionnalité à venir)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={companySettingsForm.control}
                          name="primary_color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Couleur principale</FormLabel>
                              <FormControl>
                                <div className="flex space-x-2">
                                  <Input 
                                    type="color" 
                                    {...field} 
                                    value={field.value || '#3B82F6'} 
                                    className="w-12 h-10 p-1"
                                  />
                                  <Input 
                                    type="text" 
                                    {...field} 
                                    value={field.value || '#3B82F6'} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={companySettingsForm.control}
                          name="secondary_color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Couleur secondaire</FormLabel>
                              <FormControl>
                                <div className="flex space-x-2">
                                  <Input 
                                    type="color" 
                                    {...field} 
                                    value={field.value || '#10B981'} 
                                    className="w-12 h-10 p-1"
                                  />
                                  <Input 
                                    type="text" 
                                    {...field} 
                                    value={field.value || '#10B981'} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={companySettingsForm.control}
                        name="font_family"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Police de caractères</FormLabel>
                            <FormControl>
                              <ToggleGroup type="single" value={field.value || 'Inter'} onValueChange={field.onChange}>
                                <ToggleGroupItem value="Inter" className="px-4">
                                  <span className="font-['Inter']">Inter</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="Roboto" className="px-4">
                                  <span className="font-['Roboto']">Roboto</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="Poppins" className="px-4">
                                  <span className="font-['Poppins']">Poppins</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="Montserrat" className="px-4">
                                  <span className="font-['Montserrat']">Montserrat</span>
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        "Enregistrer"
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

export default Settings;
