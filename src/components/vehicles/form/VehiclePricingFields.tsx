
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PercentIcon, Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VehiclePricingFieldsProps {
  form: UseFormReturn<any>;
}

const VehiclePricingFields: React.FC<VehiclePricingFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="base" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="base">Tarifs de base</TabsTrigger>
          <TabsTrigger value="night">Tarifs de nuit</TabsTrigger>
          <TabsTrigger value="waiting">Tarifs d'attente</TabsTrigger>
        </TabsList>
        
        {/* Tarifs de base */}
        <TabsContent value="base" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="min_trip_distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance minimale (km)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      placeholder="0"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Si la course est inférieure à cette distance, le tarif minimum sera appliqué
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minimum_trip_fare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif minimum de course (€)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      placeholder="0"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Montant minimum facturé pour une course avec ce véhicule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="holiday_sunday_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Majoration dimanches et jours fériés (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        placeholder="0"
                        {...field}
                        value={field.value || ''}
                      />
                      <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Pourcentage de majoration pour ce véhicule les dimanches et jours fériés
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        
        {/* Tarifs de nuit */}
        <TabsContent value="night" className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="night_rate_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Tarif de nuit spécifique</FormLabel>
                  <FormDescription>
                    Définir un tarif de nuit spécifique pour ce véhicule
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('night_rate_enabled') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-4 border-l-2 border-primary/20">
              <FormField
                control={form.control}
                name="night_rate_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="night_rate_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="night_rate_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage de majoration (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="15"
                          {...field}
                          value={field.value || ''} 
                        />
                        <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </TabsContent>
        
        {/* Tarifs d'attente */}
        <TabsContent value="waiting" className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="wait_price_per_15min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif par tranche de 15 minutes (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    placeholder="0"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Tarif spécifique à ce véhicule pour le temps d'attente (par tranche de 15 minutes)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="wait_night_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Tarifs d'attente de nuit</FormLabel>
                  <FormDescription>
                    Appliquer une majoration au temps d'attente pendant la nuit pour ce véhicule
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('wait_night_enabled') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-4 border-l-2 border-primary/20">
              <FormField
                control={form.control}
                name="wait_night_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wait_night_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wait_night_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage de majoration (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="15"
                          {...field}
                          value={field.value || ''} 
                        />
                        <PercentIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehiclePricingFields;
