import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

type CompanySettings = Database['public']['Tables']['company_settings']['Row'] & {
  banner_url?: string | null;
};

const companySettingsSchema = z.object({
  logo_url: z.string().optional().nullable(),
  banner_url: z.string().optional().nullable(),
  primary_color: z.string().optional().nullable(),
  secondary_color: z.string().optional().nullable(),
  font_family: z.string().optional().nullable(),
});

export type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>;

interface CompanySettingsFormProps {
  companySettings: CompanySettings | null;
  onSubmit: (values: CompanySettingsFormValues) => Promise<void>;
  saving: boolean;
}

const CompanySettingsForm = ({ companySettings, onSubmit, saving }: CompanySettingsFormProps) => {
  const { user } = useAuth();
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  
  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      logo_url: companySettings?.logo_url || "",
      banner_url: companySettings?.banner_url || "",
      primary_color: companySettings?.primary_color || "#3B82F6",
      secondary_color: companySettings?.secondary_color || "#10B981",
      font_family: companySettings?.font_family || "Inter",
    },
  });

  const uploadFile = async (file: File, type: 'logo' | 'banner') => {
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
    const fileName = `${type}-${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      type === 'logo' ? setLogoUploading(true) : setBannerUploading(true);
      
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
      
      return data.publicUrl;
    } catch (error: any) {
      console.error(`Erreur lors du téléchargement du ${type}:`, error);
      toast.error(`Erreur: ${error.message}`);
      return null;
    } finally {
      type === 'logo' ? setLogoUploading(false) : setBannerUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const publicUrl = await uploadFile(file, type);
    if (publicUrl) {
      if (type === 'logo') {
        form.setValue('logo_url', publicUrl);
        toast.success('Logo téléchargé avec succès');
      } else {
        form.setValue('banner_url', publicUrl);
        toast.success('Bannière téléchargée avec succès');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
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
                          onChange={(e) => handleFileUpload(e, 'logo')}
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
          
          <FormField
            control={form.control}
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
                          onChange={(e) => handleFileUpload(e, 'banner')}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
            control={form.control}
            name="font_family"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Police de caractères</FormLabel>
                <FormControl>
                  <ToggleGroup type="single" value={field.value || 'Inter'} onValueChange={field.onChange} className="flex flex-wrap">
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
        
        <Button type="submit" disabled={saving || logoUploading || bannerUploading}>
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
  );
};

export default CompanySettingsForm;
