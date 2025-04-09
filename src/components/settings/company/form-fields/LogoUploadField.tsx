
import React, { useState } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from 'lucide-react';
import { Control } from 'react-hook-form';
import { CompanySettingsFormValues } from '../CompanySettingsForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

interface LogoUploadFieldProps {
  control: Control<CompanySettingsFormValues>;
  user: User | null;
}

const LogoUploadField = ({ control, user }: LogoUploadFieldProps) => {
  const [logoUploading, setLogoUploading] = useState(false);

  const uploadLogo = async (file: File) => {
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
    const fileName = `logo-${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      setLogoUploading(true);
      
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
      
      toast.success('Logo téléchargé avec succès');
      return data.publicUrl;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement du logo:', error);
      toast.error(`Erreur: ${error.message}`);
      return null;
    } finally {
      setLogoUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setValue: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const publicUrl = await uploadLogo(file);
    if (publicUrl) {
      setValue(publicUrl);
    }
  };

  return (
    <FormField
      control={control}
      name="logo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Logo de l'entreprise</FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-2">
              {field.value && (
                <div className="mb-2 flex justify-center">
                  <img 
                    src={field.value} 
                    alt="Logo" 
                    className="max-h-20 max-w-xs object-contain border rounded p-1" 
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Input 
                  placeholder="URL de votre logo" 
                  {...field} 
                  value={field.value || ''}
                />
                <div className="relative">
                  <Input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, field.onChange)}
                    disabled={logoUploading}
                  />
                  <Button type="button" variant="outline" disabled={logoUploading}>
                    {logoUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Importer
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Téléchargez le logo de votre entreprise qui sera visible sur vos devis et factures
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LogoUploadField;
