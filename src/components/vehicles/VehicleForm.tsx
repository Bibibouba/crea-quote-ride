
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
import { Loader2, Upload, ImageIcon } from 'lucide-react';
import { VehicleFormValues } from '@/types/vehicle';
import { VehicleType } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  const { user } = useAuth();

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

  const uploadVehicleImage = async (file: File) => {
    if (!user) return null;
    
    if (!file || !(file instanceof File)) {
      toast.error('Fichier invalide');
      return null;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Seules les images sont acceptées');
      return null;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille du fichier doit être inférieure à 5 Mo');
      return null;
    }
    
    setImageUploading(true);
    
    try {
      // Check if vehicles bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const vehiclesBucketExists = buckets?.some(bucket => bucket.name === 'vehicles');
      
      if (!vehiclesBucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('vehicles', {
          public: true
        });
        
        if (createBucketError) {
          console.error('Error creating vehicles bucket:', createBucketError);
          throw createBucketError;
        }
      }
      
      // Generate file path
      const fileExt = file.name.split('.').pop();
      const fileName = `vehicle-${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);
        
      toast.success('Image téléchargée avec succès');
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Erreur lors du téléchargement: ${error.message}`);
      return null;
    } finally {
      setImageUploading(false);
    }
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
                  {field.value ? (
                    <div className="relative w-full h-40 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img 
                        src={field.value} 
                        alt="Véhicule" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.classList.add('hidden');
                          e.currentTarget.parentElement?.classList.add('border-dashed', 'border-2');
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-white"
                          onClick={() => field.onChange(null)}
                        >
                          Supprimer l'image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50">
                      <ImageIcon className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                  <div className="flex">
                    <Input
                      type="file"
                      id="vehicle-image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const publicUrl = await uploadVehicleImage(file);
                          if (publicUrl) {
                            field.onChange(publicUrl);
                          }
                        }
                      }}
                      disabled={imageUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={imageUploading}
                      onClick={() => {
                        document.getElementById('vehicle-image-upload')?.click();
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
                          {field.value ? "Changer l'image" : "Ajouter une image"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Une image représentative du véhicule (optionnel)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting || imageUploading}>
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
