
import React from 'react';
import { Control } from 'react-hook-form';
import { CompanySettingsFormValues } from '../CompanySettingsForm';
import { User } from '@supabase/supabase-js';
import FileUploadField from '../../shared/FileUploadField';
import { Upload } from 'lucide-react';

interface LogoUploadFieldProps {
  control: Control<CompanySettingsFormValues>;
  user: User | null;
}

const LogoUploadField = ({ control, user }: LogoUploadFieldProps) => {
  return (
    <FileUploadField
      control={control}
      name="logo_url"
      label="Logo de l'entreprise"
      description="Téléchargez le logo de votre entreprise qui sera visible sur vos devis et factures"
      user={user}
      fileNamePrefix="logo"
      icon={<Upload className="h-4 w-4 mr-2" />}
    />
  );
};

export default LogoUploadField;
