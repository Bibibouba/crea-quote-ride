
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
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
import { VehicleType } from '@/types/vehicle';

const vehicleTypeSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  icon: z.string().optional(),
});

export type VehicleTypeFormValues = z.infer<typeof vehicleTypeSchema>;

interface VehicleTypeFormProps {
  editingType: VehicleType | null;
  onSubmit: (values: VehicleTypeFormValues) => Promise<void>;
  saving: boolean;
}

const VehicleTypeForm = ({ editingType, onSubmit, saving }: VehicleTypeFormProps) => {
  const form = useForm<VehicleTypeFormValues>({
    resolver: zodResolver(vehicleTypeSchema),
    defaultValues: {
      name: editingType?.name || "",
      icon: editingType?.icon || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du type</FormLabel>
              <FormControl>
                <Input placeholder="Ex: SUV, Mini-van..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icône (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="URL ou nom de l'icône" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                Vous pouvez laisser ce champ vide pour utiliser l'icône par défaut
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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

export default VehicleTypeForm;
