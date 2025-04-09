
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import LogoUploadField from './form-fields/LogoUploadField';
import BannerUploadField from './form-fields/BannerUploadField';
import ColorSelectionFields from './form-fields/ColorSelectionFields';
import FontSelectionField from './form-fields/FontSelectionField';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <LogoUploadField 
            control={form.control} 
            user={user} 
          />
          
          <BannerUploadField 
            control={form.control} 
            user={user} 
          />
          
          <ColorSelectionFields 
            control={form.control} 
          />
          
          <FontSelectionField 
            control={form.control} 
          />
        </div>
        
        <Button type="submit" disabled={saving}>
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
