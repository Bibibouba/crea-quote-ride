
import { z } from 'zod';

// Définition du schéma de validation Zod
const vehicleFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  model: z.string().min(2, { message: 'Le modèle doit contenir au moins 2 caractères' }),
  capacity: z.coerce.number().min(1, { message: 'La capacité doit être d\'au moins 1 passager' }),
  vehicle_type_id: z.string().min(1, { message: 'Veuillez sélectionner un type de véhicule' }),
  is_luxury: z.boolean().optional(),
  is_active: z.boolean().optional(),
  image_url: z.string().nullable().optional(),
  // Paramètres de tarification
  min_trip_distance: z.coerce.number().min(0).optional(),
  night_rate_enabled: z.boolean().optional(),
  night_rate_start: z.string().optional(),
  night_rate_end: z.string().optional(),
  night_rate_percentage: z.coerce.number().min(0).optional(),
  // Paramètres de tarifs d'attente
  wait_price_per_15min: z.coerce.number().min(0).optional(),
  wait_night_enabled: z.boolean().optional(),
  wait_night_start: z.string().optional(),
  wait_night_end: z.string().optional(),
  wait_night_percentage: z.coerce.number().min(0).optional(),
  // Paramètres additionnels
  minimum_trip_fare: z.coerce.number().min(0).optional(),
  holiday_sunday_percentage: z.coerce.number().min(0).optional(),
});

export default vehicleFormSchema;
