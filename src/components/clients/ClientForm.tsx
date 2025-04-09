
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, ClientType, Gender } from '@/types/client';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building2, Phone, Mail, MapPin, Calendar, FileText, Globe, Briefcase, Hash } from 'lucide-react';

// Schema for personal client
const personalClientSchema = z.object({
  client_type: z.literal('personal'),
  gender: z.enum(['Madame', 'Mademoiselle', 'Monsieur']),
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  comments: z.string().optional(),
  birth_date: z.string().optional(),
});

// Schema for company client
const companyClientSchema = z.object({
  client_type: z.literal('company'),
  company_name: z.string().min(1, 'Le nom de la société est requis'),
  first_name: z.string().min(1, 'Le prénom du contact est requis'),
  last_name: z.string().min(1, 'Le nom du contact est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
  siret: z.string().optional(),
  vat_number: z.string().optional(),
  website: z.string().optional(),
  business_type: z.string().optional(),
  client_code: z.string().optional(),
  comments: z.string().optional(),
});

// Combined schema
const clientSchema = z.discriminatedUnion('client_type', [
  personalClientSchema,
  companyClientSchema,
]);

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Client>;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  onSuccess, 
  onCancel, 
  initialData 
}) => {
  const { addClient } = useClients();
  const { toast } = useToast();
  const [clientType, setClientType] = useState<ClientType>(
    initialData?.client_type || 'personal'
  );

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_type: clientType,
      ...(initialData as any),
    },
  });

  // Handle type change and reset form with new type
  const handleClientTypeChange = (type: ClientType) => {
    setClientType(type);
    form.reset({
      client_type: type,
      // Preserve common fields if they exist
      first_name: form.getValues().first_name,
      last_name: form.getValues().last_name,
      email: form.getValues().email,
      phone: form.getValues().phone,
      address: form.getValues().address,
      comments: form.getValues().comments,
    });
  };

  const onSubmit = async (data: ClientFormValues) => {
    try {
      // Make sure we have all required fields based on client type
      if (clientType === 'personal') {
        const personalData = data as z.infer<typeof personalClientSchema>;
        await addClient.mutateAsync({
          client_type: 'personal',
          gender: personalData.gender,
          first_name: personalData.first_name,
          last_name: personalData.last_name,
          email: personalData.email,
          phone: personalData.phone,
          address: personalData.address,
          comments: personalData.comments,
          birth_date: personalData.birth_date,
        });
      } else {
        const companyData = data as z.infer<typeof companyClientSchema>;
        await addClient.mutateAsync({
          client_type: 'company',
          company_name: companyData.company_name,
          first_name: companyData.first_name,
          last_name: companyData.last_name,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          siret: companyData.siret,
          vat_number: companyData.vat_number,
          website: companyData.website,
          business_type: companyData.business_type,
          client_code: companyData.client_code,
          comments: companyData.comments,
        });
      }
      
      toast({
        title: 'Client ajouté',
        description: 'Le client a été ajouté avec succès',
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'ajout du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Client type selector - redesigned as toggle buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            type="button"
            variant={clientType === 'personal' ? 'default' : 'outline'}
            className={`flex-1 py-6 ${clientType === 'personal' ? 'shadow-md border-primary/50' : ''}`}
            onClick={() => handleClientTypeChange('personal')}
          >
            <User className="mr-2 h-4 w-4" />
            Particulier
          </Button>
          <Button
            type="button"
            variant={clientType === 'company' ? 'default' : 'outline'}
            className={`flex-1 py-6 ${clientType === 'company' ? 'shadow-md border-primary/50' : ''}`}
            onClick={() => handleClientTypeChange('company')}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Société
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Personal client form */}
          {clientType === 'personal' && (
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Informations personnelles</h3>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Madame">Madame</SelectItem>
                            <SelectItem value="Mademoiselle">Mademoiselle</SelectItem>
                            <SelectItem value="Monsieur">Monsieur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
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
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Coordonnées</h3>
                  <div className="space-y-4">
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
                          <FormLabel>Adresse postale</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-10" {...field} />
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
                              placeholder="Commentaires..." 
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
          )}

          {/* Company client form */}
          {clientType === 'company' && (
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Informations de la société</h3>
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la société*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Nom de la société" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom du contact*</FormLabel>
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
                          <FormLabel>Nom du contact*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Coordonnées</h3>
                  <div className="space-y-4">
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
                          <FormLabel>Adresse de facturation</FormLabel>
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
                  <h3 className="font-medium mb-3">Informations administratives</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="siret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SIRET</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                          <FormLabel>TVA intracommunautaire</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="TVA" className="pl-10" {...field} />
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
                          <FormLabel>Site internet</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Site web" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="business_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'activité</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Secteur d'activité" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="client_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code client (interne)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Code client" className="pl-10" {...field} />
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
                              placeholder="Commentaires..." 
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
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={addClient.isPending}>
            {addClient.isPending ? 'Enregistrement...' : 'Enregistrer le client'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
