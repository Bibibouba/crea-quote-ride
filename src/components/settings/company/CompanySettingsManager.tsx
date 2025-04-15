
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import CompanySettingsForm, { CompanySettingsFormValues } from './CompanySettingsForm';

// Create a custom type that extends the company_settings table Row type
// and explicitly adds the new fields we've added to the database
type CompanySettings = Database['public']['Tables']['company_settings']['Row'] & {
  banner_url?: string | null;
  // Added fields
  siret?: string | null;
  company_address?: string | null;
  vat_number?: string | null;
  company_type?: string | null;
  registration_city?: string | null;
  rcs_number?: string | null;
  invoice_prefix?: string | null;
  next_invoice_number?: number | null;
  payment_delay_days?: number | null;
  late_payment_rate?: number | null;
  discount_conditions?: string | null;
  bank_details?: string | null;
  legal_notices?: string | null;
  is_vat_exempt?: boolean | null;
};

const CompanySettingsManager = () => {
  const { user } = useAuth();
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCompanySettings = async () => {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .eq('driver_id', user.id)
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setCompanySettings(data[0]);
        } else {
          const { data: newSettings, error: createError } = await supabase
            .from('company_settings')
            .insert({
              driver_id: user.id,
              primary_color: "#3B82F6",
              secondary_color: "#10B981",
              font_family: "Inter",
              invoice_prefix: "FACT-",
              next_invoice_number: 1,
              payment_delay_days: 30,
              late_payment_rate: 10.5,
              is_vat_exempt: false
            })
            .select();

          if (createError) throw createError;
          if (newSettings && newSettings.length > 0) {
            setCompanySettings(newSettings[0]);
          }
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.error('Erreur lors du chargement des paramètres d\'entreprise');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanySettings();
  }, [user]);

  const handleCompanySettingsSubmit = async (values: CompanySettingsFormValues) => {
    if (!user || !companySettings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          // Style fields
          logo_url: values.logo_url,
          banner_url: values.banner_url,
          primary_color: values.primary_color,
          secondary_color: values.secondary_color,
          font_family: values.font_family,
          
          // Company information fields
          company_type: values.company_type,
          company_address: values.company_address,
          siret: values.siret,
          vat_number: values.vat_number,
          registration_city: values.registration_city,
          rcs_number: values.rcs_number,
          is_vat_exempt: values.is_vat_exempt,
          
          // Invoice settings fields
          invoice_prefix: values.invoice_prefix,
          next_invoice_number: values.next_invoice_number,
          payment_delay_days: values.payment_delay_days,
          late_payment_rate: values.late_payment_rate,
          discount_conditions: values.discount_conditions,
          bank_details: values.bank_details,
          legal_notices: values.legal_notices,
          
          updated_at: new Date().toISOString(),
        })
        .eq('id', companySettings.id);

      if (error) throw error;
      
      toast.success('Paramètres d\'entreprise enregistrés');
      
      // Update local state with the new values
      setCompanySettings({
        ...companySettings,
        // Style fields
        logo_url: values.logo_url,
        banner_url: values.banner_url,
        primary_color: values.primary_color,
        secondary_color: values.secondary_color,
        font_family: values.font_family,
        
        // Company information fields
        company_type: values.company_type,
        company_address: values.company_address,
        siret: values.siret,
        vat_number: values.vat_number,
        registration_city: values.registration_city,
        rcs_number: values.rcs_number,
        is_vat_exempt: values.is_vat_exempt,
        
        // Invoice settings fields
        invoice_prefix: values.invoice_prefix,
        next_invoice_number: values.next_invoice_number,
        payment_delay_days: values.payment_delay_days,
        late_payment_rate: values.late_payment_rate,
        discount_conditions: values.discount_conditions,
        bank_details: values.bank_details,
        legal_notices: values.legal_notices,
        
        updated_at: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement des paramètres:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de l'entreprise</CardTitle>
        <CardDescription>
          Personnalisez votre profil d'entreprise et les informations affichées sur vos devis et factures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompanySettingsForm 
          companySettings={companySettings} 
          onSubmit={handleCompanySettingsSubmit}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
};

export default CompanySettingsManager;
