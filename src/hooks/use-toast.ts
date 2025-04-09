
// Exported from shadcn to fix import issues with Toaster
import { useToast as useShadcnToast } from '@/components/ui/toast'

export const useToast = useShadcnToast;
export const toast = useShadcnToast().toast;
