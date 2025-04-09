
import React from 'react';
import { Control } from 'react-hook-form';
import { CompanySettingsFormValues } from '../CompanySettingsForm';
import { User } from '@supabase/supabase-js';
import FileUploadField from '../../shared/FileUploadField';
import { Image as ImageIcon } from 'lucide-react';

interface BannerUploadFieldProps {
  control: Control<CompanySettingsFormValues>;
  user: User | null;
}

const BannerUploadField = ({ control, user }: BannerUploadFieldProps) => {
  return (
    <FileUploadField
      control={control}
      name="banner_url"
      label="Bannière de l'application"
      description="Téléchargez une bannière qui sera visible en haut de votre application personnalisée"
      user={user}
      fileNamePrefix="banner"
      previewClassName="max-h-40 w-full object-cover border rounded"
      icon={<ImageIcon className="h-4 w-4 mr-2" />}
    />
  );
};

export default BannerUploadField;
