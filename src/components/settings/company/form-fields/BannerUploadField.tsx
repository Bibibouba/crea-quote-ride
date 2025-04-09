
import React, { useState } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Control } from 'react-hook-form';
import { CompanySettingsFormValues } from '../CompanySettingsForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

interface BannerUploadFieldProps {
  control: Control<CompanySettingsFormValues>;
  user: User | null;
}

const BannerUploadField = ({ control, user }: BannerUploadFieldProps) => {
  const [bannerUploading, setBannerUploading] = useState(false);

  const uploadBanner = async (file: File) => {
    if (!user) {
      toast.error('Vous devez être connecté pour télécharger des fichiers');
      return null;
    }

    if (!file || !(file instanceof File)) {
      toast.error('Fichier invalide');
      return null;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Seules les images sont acceptées');
      return null;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La taille du fichier doit être inférieure à 2 Mo');
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `banner-${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      setBannerUploading(true);
      
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'company-assets')) {
        await supabase.storage.createBucket('company-assets', {
          public: true,
          fileSizeLimit: 2097152, // 2MB
        });
      }
      
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);
      
      toast.success('Bannière téléchargée avec succès');
      return data.publicUrl;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement de la bannière:', error);
      toast.error(`Erreur: ${error.message}`);
      return null;
    } finally {
      setBannerUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setValue: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const publicUrl = await uploadBanner(file);
    if (publicUrl) {
      setValue(publicUrl);
    }
  };

  return (
    <FormField
      control={control}
      name="banner_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bannière de l'application</FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-2">
              {field.value && (
                <div className="mb-2 flex justify-center">
                  <img 
                    src={field.value} 
                    alt="Bannière" 
                    className="max-h-40 w-full object-cover border rounded" 
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Input 
                  placeholder="URL de votre bannière" 
                  {...field} 
                  value={field.value || ''}
                />
                <div className="relative">
                  <Input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, field.onChange)}
                    disabled={bannerUploading}
                  />
                  <Button type="button" variant="outline" disabled={bannerUploading}>
                    {bannerUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4 mr-2" />
                    )}
                    Importer
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Téléchargez une bannière qui sera visible en haut de votre application personnalisée
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BannerUploadField;
