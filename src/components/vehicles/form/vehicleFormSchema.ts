
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
});

export default vehicleFormSchema;
