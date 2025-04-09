
// Importer directement depuis Radix UI Toast au lieu de la version shadcn
import { toast as toastFunction } from "@/components/ui/toast/use-toast";
import { type ToastProps } from "@/components/ui/toast";

// Exporter l'interface pour une utilisation par le consommateur
export interface UseToastReturn {
  toast: (props: ToastProps) => void;
  toasts: ToastProps[];
  dismiss: (toastId?: string) => void;
}

// Créer et exporter notre hook personnalisé
export const useToast = (): UseToastReturn => {
  return {
    toast: toastFunction,
    toasts: [], // À remplacer par un vrai état si nécessaire
    dismiss: () => {} // À implémenter si nécessaire
  };
};

// Exporter toast pour une utilisation plus facile
export const toast = toastFunction;
