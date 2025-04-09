import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Car, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the vehicle type
interface Vehicle {
  id: string;
  name: string;
  model: string;
  capacity: number;
  image_url?: string;
  is_luxury: boolean;
  is_active: boolean;
  vehicle_type_name?: string;
}

const vehicleSchema = z.object({
  name: z.string().min(1, "Le nom du véhicule est requis"),
  model: z.string().min(1, "Le modèle est requis"),
  capacity: z.coerce.number().min(1, "La capacité doit être d'au moins 1 passager"),
  image_url: z.string().optional(),
  is_luxury: z.boolean().default(false),
  is_active: z.boolean().default(true),
  vehicle_type_name: z.string().default("Berline"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      model: "",
      capacity: 4,
      image_url: "",
      is_luxury: false,
      is_active: true,
      vehicle_type_name: "Berline",
    },
  });

  // Load vehicles
  useEffect(() => {
    if (!user) return;
    
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setVehicles(data || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Erreur lors du chargement des véhicules');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [user]);

  const onSubmit = async (values: VehicleFormValues) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const { error } = await supabase
          .from('vehicles')
          .update({
            name: values.name,
            model: values.model,
            capacity: values.capacity,
            image_url: values.image_url,
            is_luxury: values.is_luxury,
            is_active: values.is_active,
            vehicle_type_name: values.vehicle_type_name || "Berline",
          })
          .eq('id', editingVehicle.id);
          
        if (error) throw error;
        
        // Update local state
        setVehicles(vehicles.map(v => 
          v.id === editingVehicle.id ? { ...v, ...values } : v
        ));
        toast.success('Véhicule mis à jour avec succès');
      } else {
        // Create new vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .insert({
            name: values.name,
            model: values.model, 
            capacity: values.capacity,
            image_url: values.image_url,
            is_luxury: values.is_luxury,
            is_active: values.is_active,
            vehicle_type_name: values.vehicle_type_name || "Berline",
            driver_id: user.id
          })
          .select();
          
        if (error) throw error;
        
        // Update local state
        setVehicles([data[0], ...vehicles]);
        toast.success('Véhicule ajouté avec succès');
      }
      
      // Close dialog and reset form
      setOpen(false);
      setEditingVehicle(null);
      form.reset();
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.reset({
      name: vehicle.name,
      model: vehicle.model,
      capacity: vehicle.capacity,
      image_url: vehicle.image_url || "",
      is_luxury: vehicle.is_luxury,
      is_active: vehicle.is_active,
      vehicle_type_name: vehicle.vehicle_type_name || "Berline",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success('Véhicule supprimé avec succès');
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    form.reset({
      name: "",
      model: "",
      capacity: 4,
      image_url: "",
      is_luxury: false,
      is_active: true,
      vehicle_type_name: "Berline",
    });
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vos véhicules</h1>
            <p className="text-muted-foreground">
              Gérez les véhicules que vous proposez à vos clients
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : vehicles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Car className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">Aucun véhicule</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Vous n'avez pas encore ajouté de véhicule à votre flotte.
              </p>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter votre premier véhicule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className={!vehicle.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{vehicle.name}</CardTitle>
                    {!vehicle.is_active && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        Inactif
                      </span>
                    )}
                  </div>
                  <CardDescription>{vehicle.model}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                      <span>{vehicle.capacity} passagers</span>
                    </div>
                    {vehicle.is_luxury && (
                      <div className="flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs">
                        <span>Premium</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
              </DialogTitle>
              <DialogDescription>
                Renseignez les informations de votre véhicule ci-dessous
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du véhicule</FormLabel>
                      <FormControl>
                        <Input placeholder="Berline standard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle</FormLabel>
                      <FormControl>
                        <Input placeholder="Mercedes Classe E" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacité (passagers)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle_type_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de véhicule</FormLabel>
                      <FormControl>
                        <Input placeholder="Berline" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="is_luxury"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Véhicule premium
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Véhicule actif
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
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
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
