
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Loader2, Upload } from 'lucide-react';
import { VehicleFormValues } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicleType';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  model: z.string().min(1, 'Le modèle est requis'),
  capacity: z.coerce.number().min(1, 'La capacité doit être d\'au moins 1'),
  vehicle_type_id: z.string().min(1, 'Le type de véhicule est requis'),
  is_active: z.boolean().optional().default(true),
  is_luxury: z.boolean().optional().default(false),
  image_url: z.string().optional().nullable(),
  vehicle_type_name: z.string().optional().nullable(),
});

interface VehicleFormProps {
  initialValues?: Partial<VehicleFormValues>;
  onSubmit: (data: VehicleFormValues) => void;
  vehicleTypes: VehicleType[];
  isSubmitting: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  initialValues, 
  onSubmit, 
  vehicleTypes,
  isSubmitting 
}) => {
  const [imageUploading, setImageUploading] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      model: initialValues?.model || '',
      capacity: initialValues?.capacity || 4,
      vehicle_type_id: initialValues?.vehicle_type_id || '',
      is_active: initialValues?.is_active !== undefined ? initialValues.is_active : true,
      is_luxury: initialValues?.is_luxury || false,
      image_url: initialValues?.image_url || null,
      vehicle_type_name: initialValues?.vehicle_type_name || null,
    },
  });

  const handleSubmit = (data: VehicleFormValues) => {
    // Set the vehicle_type_name based on the selected vehicle_type_id
    const selectedType = vehicleTypes.find(type => type.id === data.vehicle_type_id);
    if (selectedType) {
      data.vehicle_type_name = selectedType.name;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du véhicule</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ma Mercedes-Benz Classe E" {...field} />
              </FormControl>
              <FormDescription>
                Nom que vous utilisez pour identifier ce véhicule
              </FormDescription>
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
                <Input placeholder="Ex: Mercedes-Benz Classe E" {...field} />
              </FormControl>
              <FormDescription>
                Marque et modèle du véhicule
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité (passagers)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  Nombre maximum de passagers
                </FormDescription>
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
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
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
                <FormDescription>
                  Catégorie de ce véhicule
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
                
        <div className="grid grid-cols-2 gap-4">
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
                  <FormLabel>
                    Véhicule de luxe
                  </FormLabel>
                  <FormDescription>
                    Indiquez si ce véhicule est considéré comme "de luxe"
                  </FormDescription>
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
                  <FormLabel>
                    Véhicule actif
                  </FormLabel>
                  <FormDescription>
                    Décochez pour désactiver temporairement ce véhicule
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image du véhicule</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  {field.value && (
                    <div className="relative w-full h-40 rounded-md overflow-hidden">
                      <img 
                        src={field.value} 
                        alt="Véhicule" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={imageUploading}
                    onClick={() => {
                      // Placeholder for image upload functionality
                      console.log("Image upload not implemented yet");
                    }}
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {field.value ? "Modifier l'image" : "Ajouter une image"}
                      </>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Une image représentative du véhicule (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : initialValues?.id ? "Modifier le véhicule" : "Créer le véhicule"}
        </Button>
      </form>
    </Form>
  );
};

export default VehicleForm;
