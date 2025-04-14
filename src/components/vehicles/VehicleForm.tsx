
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { VehicleFormValues, Vehicle, VehicleType } from '@/types/vehicle';

// Import des composants refactorisés
import VehicleBasicInfoFields from './form/VehicleBasicInfoFields';
import VehicleTypeFields from './form/VehicleTypeFields';
import VehicleOptionsFields from './form/VehicleOptionsFields';
import VehicleFormActions from './form/VehicleFormActions';
import vehicleFormSchema from './form/vehicleFormSchema';

interface VehicleFormProps {
  initialValues?: Partial<Vehicle>;
  vehicleTypes: VehicleType[];
  onSubmit: (data: VehicleFormValues) => void;
  isSubmitting: boolean;
  onDeleteClick?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  initialValues, 
  vehicleTypes, 
  onSubmit,
  isSubmitting,
  onDeleteClick
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      model: initialValues?.model || '',
      capacity: initialValues?.capacity || 4,
      vehicle_type_id: initialValues?.vehicle_type_id || '',
      is_luxury: initialValues?.is_luxury || false,
      is_active: initialValues?.is_active !== undefined ? initialValues.is_active : true,
      image_url: initialValues?.image_url || null,
    },
  });

  const handleSubmit = (values: VehicleFormValues) => {
    const selectedType = vehicleTypes.find(t => t.id === values.vehicle_type_id);
    onSubmit({
      ...values,
      vehicle_type_name: selectedType?.name || null
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <VehicleBasicInfoFields form={form} />
        <VehicleTypeFields form={form} vehicleTypes={vehicleTypes} />
        <VehicleOptionsFields form={form} />
        <VehicleFormActions 
          isSubmitting={isSubmitting} 
          onDeleteClick={onDeleteClick} 
        />
      </form>
    </Form>
  );
};

export default VehicleForm;
