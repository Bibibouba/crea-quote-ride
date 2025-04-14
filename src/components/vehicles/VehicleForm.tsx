
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useVehicles } from '@/hooks/useVehicles';
import { Vehicle } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicleType';
import { Loader2 } from 'lucide-react';

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Le nom du véhicule doit comporter au moins 2 caractères.',
  }),
  model: z.string().min(1, {
    message: 'Le modèle du véhicule est requis.',
  }),
  capacity: z.number().min(1, {
    message: 'La capacité doit être d\'au moins 1 personne.',
  }),
  image_url: z.string().optional(),
  is_luxury: z.boolean().default(false),
  is_active: z.boolean().default(true),
  vehicle_type_id: z.string().min(1, {
    message: 'Veuillez sélectionner un type de véhicule.',
  }),
  vehicle_type_name: z.string().optional()
});

// Export the form values type for use in other components
export type VehicleFormValues = z.infer<typeof formSchema>;

export interface VehicleFormProps {
  vehicle?: Vehicle | null;
  vehicleTypes: VehicleType[];
  onSuccess: () => void;
  onCancel: () => void;
}

const VehicleForm = ({ vehicle, vehicleTypes, onSuccess, onCancel }: VehicleFormProps) => {
  const { submitting, handleSaveVehicle } = useVehicles();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vehicle?.name || '',
      model: vehicle?.model || '',
      capacity: vehicle?.capacity || 4,
      image_url: vehicle?.image_url || '',
      is_luxury: vehicle?.is_luxury || false,
      is_active: vehicle?.is_active || true,
      vehicle_type_id: vehicle?.vehicle_type_id || (vehicleTypes.length > 0 ? vehicleTypes[0].id : ''),
      vehicle_type_name: vehicle?.vehicle_type_name || '',
    },
  });

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      const success = await handleSaveVehicle(values, vehicle);
      if (success) {
        form.reset();
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du véhicule:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du véhicule</FormLabel>
              <FormControl>
                <Input placeholder="Mercedes Classe S" {...field} />
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
                <Input placeholder="S500" {...field} />
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
                <Input 
                  type="number" 
                  min={1} 
                  max={20}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de véhicule</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_luxury"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Véhicule de luxe</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Véhicule actif</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
