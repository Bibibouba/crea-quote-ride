
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import vehicleFormSchema from './vehicleFormSchema';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import VehicleBasicInfoFields from './VehicleBasicInfoFields';
import VehicleTypeFields from './VehicleTypeFields';
import VehicleOptionsFields from './VehicleOptionsFields';
import VehicleFormActions from './VehicleFormActions';
import VehiclePricingFields from './VehiclePricingFields';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VehicleFormProps {
  initialData?: Vehicle;
  onSubmit: (data: z.infer<typeof vehicleFormSchema>) => Promise<void>;
  onCancel: () => void;
  onDeleteClick?: () => void;
  isLoading?: boolean;
  vehicleTypes: any[];
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onDeleteClick,
  isLoading = false,
  vehicleTypes,
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      model: initialData?.model || '',
      capacity: initialData?.capacity || 4,
      vehicle_type_id: initialData?.vehicle_type_id || '',
      is_luxury: initialData?.is_luxury || false,
      is_active: initialData?.is_active !== false, // Par défaut actif sauf si explicitement inactif
      image_url: initialData?.image_url || null,
      min_trip_distance: initialData?.min_trip_distance || 0,
      night_rate_enabled: initialData?.night_rate_enabled || false,
      night_rate_start: initialData?.night_rate_start || "20:00",
      night_rate_end: initialData?.night_rate_end || "06:00",
      night_rate_percentage: initialData?.night_rate_percentage || 15,
    },
  });

  const handleSubmit = async (data: z.infer<typeof vehicleFormSchema>) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="pricing">Tarification</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-6 pt-4">
            <VehicleBasicInfoFields form={form} />
            <VehicleTypeFields form={form} vehicleTypes={vehicleTypes} />
          </TabsContent>
          <TabsContent value="options" className="space-y-6 pt-4">
            <VehicleOptionsFields form={form} />
          </TabsContent>
          <TabsContent value="pricing" className="space-y-6 pt-4">
            <VehiclePricingFields form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            {onDeleteClick && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={onDeleteClick}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Supprimer
              </Button>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>Enregistrer</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
