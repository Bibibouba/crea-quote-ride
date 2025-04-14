
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { Building2, Mail, Phone, MapPin, FileText, Info, Globe, CreditCard, Users } from 'lucide-react';

interface CompanyClientFormProps {
  form: UseFormReturn<any>;
}

const CompanyClientForm: React.FC<CompanyClientFormProps> = ({ form }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Informations de l'entreprise</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Nom de l'entreprise" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIRET</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Info className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="SIRET" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vat_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° TVA</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="N° TVA" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'activité</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Type d'activité" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://..." className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="client_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code client</FormLabel>
                  <FormControl>
                    <Input placeholder="Code client interne" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Contact principal</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom*</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="Email" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Téléphone" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Adresse" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Informations complémentaires</h3>
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaires / Notes</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      placeholder="Commentaires sur le client..." 
                      className="min-h-24 pl-10 pt-6" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyClientForm;
