
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
}

interface DistanceTier {
  id?: string;
  min_km: number;
  max_km: number | null;
  price_per_km: number;
  vehicle_id: string | null;
}

const distanceTierSchema = z.object({
  min_km: z.coerce.number().min(0, "La distance minimale doit être positive"),
  max_km: z.coerce.number().nullable().optional(),
  price_per_km: z.coerce.number().min(0, "Le tarif par km doit être positif"),
  vehicle_id: z.string().nullable().optional(),
});

interface DistanceTierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: z.infer<typeof distanceTierSchema>) => Promise<void>;
  editingTier: DistanceTier | null;
  vehicles: Vehicle[];
  saving: boolean;
}

const DistanceTierDialog = ({
  open,
  onOpenChange,
  onSave,
  editingTier,
  vehicles,
  saving,
}: DistanceTierDialogProps) => {
  const form = useForm<z.infer<typeof distanceTierSchema>>({
    resolver: zodResolver(distanceTierSchema),
    defaultValues: {
      min_km: editingTier?.min_km || 0,
      max_km: editingTier?.max_km || null,
      price_per_km: editingTier?.price_per_km || 1.75,
      vehicle_id: editingTier?.vehicle_id || null,
    },
  });

  // Reset form when editing tier changes
  React.useEffect(() => {
    if (editingTier) {
      form.reset({
        min_km: editingTier.min_km,
        max_km: editingTier.max_km,
        price_per_km: editingTier.price_per_km, 
        vehicle_id: editingTier.vehicle_id,
      });
    }
  }, [editingTier, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTier ? "Modifier le palier" : "Ajouter un palier de tarification"}
          </DialogTitle>
          <DialogDescription>
            Définissez un palier de tarification en fonction de la distance
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              control={form.control}
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
              <Button type="submit" disabled={saving}>
                {saving ? (
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
  );
};

export default DistanceTierDialog;
