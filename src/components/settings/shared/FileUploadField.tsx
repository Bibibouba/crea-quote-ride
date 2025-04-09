
import React, { useState } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from 'lucide-react';
import { Control } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';

interface FileUploadFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
  user: User | null;
  fileNamePrefix: string;
  previewClassName?: string;
  icon?: React.ReactNode;
}

const FileUploadField = ({ 
  control, 
  name, 
  label, 
  description, 
  user, 
  fileNamePrefix,
  previewClassName = "max-h-20 max-w-xs object-contain border rounded p-1",
  icon = <Upload className="h-4 w-4 mr-2" />
}: FileUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
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
    const fileName = `${fileNamePrefix}-${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      setIsUploading(true);
      
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
      
      toast.success('Fichier téléchargé avec succès');
      return data.publicUrl;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      toast.error(`Erreur: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setValue: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const publicUrl = await uploadFile(file);
    if (publicUrl) {
      setValue(publicUrl);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-2">
              {field.value && (
                <div className="mb-2 flex justify-center">
                  <img 
                    src={field.value} 
                    alt={label} 
                    className={previewClassName}
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Input 
                  placeholder={`URL de votre ${label.toLowerCase()}`} 
                  {...field} 
                  value={field.value || ''}
                />
                <div className="relative">
                  <Input
                    type="file"
                    id={`${name}-upload`}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, field.onChange)}
                    disabled={isUploading}
                  />
                  <Button type="button" variant="outline" disabled={isUploading}>
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : icon}
                    Importer
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadField;
