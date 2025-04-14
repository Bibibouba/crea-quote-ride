import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import LogoUploadField from './form-fields/LogoUploadField';
import BannerUploadField from './form-fields/BannerUploadField';
import ColorSelectionFields from './form-fields/ColorSelectionFields';
import FontSelectionField from './form-fields/FontSelectionField';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type CompanySettings = Database['public']['Tables']['company_settings']['Row'] & {
  banner_url?: string | null;
  company_name?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  contact_email?: string | null;
};

const companySettingsSchema = z.object({
  logo_url: z.string().optional().nullable(),
  banner_url: z.string().optional().nullable(),
  primary_color: z.string().optional().nullable(),
  secondary_color: z.string().optional().nullable(),
  font_family: z.string().optional().nullable(),
  
  company_name: z.string().optional().nullable(),
  contact_first_name: z.string().optional().nullable(),
  contact_last_name: z.string().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  
  invoice_prefix: z.string().optional(),
  next_invoice_number: z.coerce.number().optional(),
  payment_delay_days: z.coerce.number().optional(),
  late_payment_rate: z.coerce.number().optional(),
  discount_conditions: z.string().optional(),
  bank_details: z.string().optional(),
  legal_notices: z.string().optional(),
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
      
      company_name: companySettings?.company_name || "",
      contact_first_name: companySettings?.contact_first_name || "",
      contact_last_name: companySettings?.contact_last_name || "",
      contact_email: companySettings?.contact_email || "",
      
      invoice_prefix: companySettings?.invoice_prefix || "FACT-",
      next_invoice_number: companySettings?.next_invoice_number || 1,
      payment_delay_days: companySettings?.payment_delay_days || 30,
      late_payment_rate: companySettings?.late_payment_rate || 10.5,
      discount_conditions: companySettings?.discount_conditions || "",
      bank_details: companySettings?.bank_details || "",
      legal_notices: companySettings?.legal_notices || "TVA non applicable, art. 293 B du CGI",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="style">Style & Apparence</TabsTrigger>
            <TabsTrigger value="company">Informations Société</TabsTrigger>
            <TabsTrigger value="invoice">Paramètres Facture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="company" className="space-y-4">
            <div className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de votre entreprise" {...field} />
                    </FormControl>
                    <FormDescription>
                      Le nom officiel de votre entreprise
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Contact principal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Email du contact</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Email de contact" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Email de la personne à contacter pour cette entreprise
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="company_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'entreprise</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type d'entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="micro-entreprise">Micro-entreprise (ex auto-entrepreneur)</SelectItem>
                        <SelectItem value="ei">Entreprise Individuelle (EI)</SelectItem>
                        <SelectItem value="eurl">EURL (Entreprise Unipersonnelle à Responsabilité Limitée)</SelectItem>
                        <SelectItem value="sasu">SASU (Société par Actions Simplifiée Unipersonnelle)</SelectItem>
                        <SelectItem value="sarl">SARL ou SAS (si vous êtes plusieurs)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Ce choix déterminera les mentions légales sur vos factures
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adresse complète de l'entreprise"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Obligatoire pour vos factures
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro SIRET</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123 456 789 00012" {...field} />
                      </FormControl>
                      <FormDescription>
                        Obligatoire pour vos factures
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vat_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro TVA</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: FR12345678900" {...field} />
                      </FormControl>
                      <FormDescription>
                        Si applicable
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registration_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville d'immatriculation</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Paris" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pour le RCS (sociétés commerciales)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rcs_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro RCS</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro RCS si applicable" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pour les sociétés commerciales
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="is_vat_exempt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Exonération de TVA (franchise en base)
                      </FormLabel>
                      <FormDescription>
                        Cochez si vous êtes en franchise en base de TVA (auto-entrepreneur ou autre régime d'exonération)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="invoice" className="space-y-4">
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoice_prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Préfixe des factures</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: FACT-" {...field} />
                      </FormControl>
                      <FormDescription>
                        Préfixe utilisé pour vos numéros de facture
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="next_invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prochain numéro de facture</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Numéro qui sera utilisé pour la prochaine facture
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_delay_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai de paiement (jours)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Délai de paiement à compter de l'émission de la facture
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="late_payment_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux de pénalité de retard (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Taux applicable en cas de retard de paiement
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="discount_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditions d'escompte</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conditions d'escompte en cas de paiement anticipé"
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormDescription>
                      Laissez vide si aucun escompte n'est proposé
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bank_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordonnées bancaires</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="IBAN, BIC, etc."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Informations de paiement pour vos clients
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="legal_notices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentions légales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mentions légales à ajouter sur vos factures"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Ex: TVA non applicable, art. 293 B du CGI (pour auto-entrepreneurs)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
        
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
