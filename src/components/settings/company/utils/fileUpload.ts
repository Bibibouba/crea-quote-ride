
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FileUploadOptions {
  user: User | null;
  file: File;
  fileType: 'logo' | 'banner';
  maxSizeMB?: number;
}

export const validateFile = (file: File, maxSizeMB: number = 2) => {
  if (!file || !(file instanceof File)) {
    toast.error('Fichier invalide');
    return false;
  }

  if (!file.type.startsWith('image/')) {
    toast.error('Seules les images sont acceptées');
    return false;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    toast.error(`La taille du fichier doit être inférieure à ${maxSizeMB} Mo`);
    return false;
  }

  return true;
};

export const uploadFile = async ({ user, file, fileType, maxSizeMB = 2 }: FileUploadOptions) => {
  if (!user) {
    toast.error('Vous devez être connecté pour télécharger des fichiers');
    return null;
  }

  if (!validateFile(file, maxSizeMB)) {
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${fileType}-${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  try {
    // Ensure the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(bucket => bucket.name === 'company-assets')) {
      await supabase.storage.createBucket('company-assets', {
        public: true,
        fileSizeLimit: 2097152, // 2MB
      });
    }
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('company-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage
      .from('company-assets')
      .getPublicUrl(filePath);
    
    toast.success(`${fileType === 'logo' ? 'Logo' : 'Bannière'} téléchargé avec succès`);
    return data.publicUrl;
  } catch (error: any) {
    console.error(`Erreur lors du téléchargement du ${fileType}:`, error);
    toast.error(`Erreur: ${error.message}`);
    return null;
  }
};
