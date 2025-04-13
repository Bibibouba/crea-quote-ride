
import React from 'react';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { VehicleType } from '@/integrations/supabase/client';

export const vehicleSchema = z.object({
  name: z.string().min(1, "Le nom du véhicule est requis"),
  model: z.string().min(1, "Le modèle est requis"),
  capacity: z.coerce.number().min(1, "La capacité doit être d'au moins 1 passager"),
  image_url: z.string().optional(),
  is_luxury: z.boolean().default(false),
  is_active: z.boolean().default(true),
  vehicle_type_id: z.string().min(1, "Le type de véhicule est requis"),
  vehicle_type_name: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  defaultValues: VehicleFormValues;
  vehicleTypes: VehicleType[];
  typesLoading: boolean;
  submitting: boolean;
  onSubmit: (values: VehicleFormValues) => void;
}

const VehicleForm = ({ 
  defaultValues, 
  vehicleTypes, 
  typesLoading, 
  submitting, 
  onSubmit 
}: VehicleFormProps) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du véhicule</FormLabel>
              <FormControl>
                <Input placeholder="Berline standard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input placeholder="Mercedes Classe E" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacité (passagers)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de véhicule</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de véhicule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typesLoading ? (
                    <div className="flex justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    vehicleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="is_luxury"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Véhicule premium
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Véhicule actif
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default VehicleForm;
