
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Upload } from 'lucide-react';
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

type CompanySettings = Database['public']['Tables']['company_settings']['Row'];

const companySettingsSchema = z.object({
  logo_url: z.string().optional().nullable(),
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
  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      logo_url: companySettings?.logo_url || "",
      primary_color: companySettings?.primary_color || "#3B82F6",
      secondary_color: companySettings?.secondary_color || "#10B981",
      font_family: companySettings?.font_family || "Inter",
    },
  });

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
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="URL de votre logo" 
                      {...field} 
                      value={field.value || ''}
                    />
                    <Button type="button" variant="outline" disabled>
                      <Upload className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Entrez l'URL de votre logo ou importez une image (fonctionnalité à venir)
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
                  <ToggleGroup type="single" value={field.value || 'Inter'} onValueChange={field.onChange}>
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
