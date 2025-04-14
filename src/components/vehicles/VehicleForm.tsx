
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { VehicleFormValues, Vehicle, VehicleType } from '@/types/vehicle';
import { Loader2, Save, Trash2 } from 'lucide-react';

// Définition du schéma de validation Zod
const vehicleFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  model: z.string().min(2, { message: 'Le modèle doit contenir au moins 2 caractères' }),
  capacity: z.coerce.number().min(1, { message: 'La capacité doit être d\'au moins 1 passager' }),
  vehicle_type_id: z.string().min(1, { message: 'Veuillez sélectionner un type de véhicule' }),
  is_luxury: z.boolean().optional(),
  is_active: z.boolean().optional(),
  image_url: z.string().nullable().optional(),
});

interface VehicleFormProps {
  initialValues?: Partial<Vehicle>;
  vehicleTypes: VehicleType[];
  onSubmit: (data: VehicleFormValues) => void;
  isSubmitting: boolean;
  onDeleteClick?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  initialValues, 
  vehicleTypes, 
  onSubmit,
  isSubmitting,
  onDeleteClick
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      model: initialValues?.model || '',
      capacity: initialValues?.capacity || 4,
      vehicle_type_id: initialValues?.vehicle_type_id || '',
      is_luxury: initialValues?.is_luxury || false,
      is_active: initialValues?.is_active !== undefined ? initialValues.is_active : true,
      image_url: initialValues?.image_url || null,
    },
  });

  const handleSubmit = (values: VehicleFormValues) => {
    const selectedType = vehicleTypes.find(t => t.id === values.vehicle_type_id);
    onSubmit({
      ...values,
      vehicle_type_name: selectedType?.name || null
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du véhicule</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Mercedes" {...field} />
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
                  <Input placeholder="Ex: Classe E" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicle_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de véhicule</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
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
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité (passagers)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="is_luxury"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Véhicule de luxe</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Véhicule actif</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between">
          {onDeleteClick && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={onDeleteClick}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={`ml-auto flex items-center gap-1 ${!onDeleteClick ? 'ml-auto' : ''}`}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
