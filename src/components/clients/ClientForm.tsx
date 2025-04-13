
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useClientsFilterStore } from "@/hooks/useClientsFilterStore";
import CompanyClientForm from './client-form/CompanyClientForm';
import PersonalClientForm from './client-form/PersonalClientForm';

// Define client form schema
const clientFormSchema = z.object({
  client_type: z.enum(["personal", "business"]),
  // Common fields for both types
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  phone: z.string().min(10, {
    message: "Le numéro de téléphone doit contenir au moins 10 chiffres.",
  }),
  address: z.string().optional(),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof clientFormSchema>;

// Extend for personal client
const personalClientSchema = clientFormSchema.extend({
  client_type: z.literal("personal"),
  first_name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  last_name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  gender: z.enum(["Madame", "Mademoiselle", "Monsieur"]),
  birth_date: z.string().optional(),
});

// Extend for business client
const businessClientSchema = clientFormSchema.extend({
  client_type: z.literal("business"),
  company_name: z.string().min(2, {
    message: "Le nom de l'entreprise doit contenir au moins 2 caractères.",
  }),
  contact_name: z.string().min(2, {
    message: "Le nom du contact doit contenir au moins 2 caractères.",
  }),
  siret: z.string().optional(),
  notes: z.string().optional(),
});

// Combine schemas
const combinedSchema = z.discriminatedUnion("client_type", [
  personalClientSchema,
  businessClientSchema,
]);

type ClientFormProps = {
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  isSubmitting?: boolean;
};

export const ClientForm = ({ onSubmit, initialValues, isSubmitting = false }: ClientFormProps) => {
  const { setClientType } = useClientsFilterStore();
  
  // Determine initial client type from the initial values or default to personal
  const initialClientType = initialValues?.client_type || "personal";
  
  const form = useForm<z.infer<typeof combinedSchema>>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      client_type: initialClientType,
      ...initialValues,
    },
  });

  const watchClientType = form.watch("client_type");

  const handleSubmit = async (values: z.infer<typeof combinedSchema>) => {
    // If submitting a personal client, combine first and last name for full_name
    const submitValues = {
      ...values,
      full_name: values.client_type === "personal" 
        ? `${values.first_name} ${values.last_name}` 
        : values.company_name
    };

    // Call the onSubmit callback with processed values
    await onSubmit(submitValues);
    
    // Update the filter store with the new client type
    setClientType(values.client_type);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="client_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type de client</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="personal" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Particulier
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="business" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Entreprise
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {watchClientType === "personal" ? (
          <PersonalClientForm form={form} />
        ) : (
          <CompanyClientForm form={form} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemple.com" {...field} />
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
                  <Input placeholder="06 XX XX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="123 rue de Paris, 75001 Paris" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaires</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes ou observations sur ce client"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
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

export default ClientForm;
