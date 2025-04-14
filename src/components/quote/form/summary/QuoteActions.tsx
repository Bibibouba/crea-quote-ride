
import { Button } from '@/components/ui/button';
import { DollarSignIcon, Loader2 } from 'lucide-react';

interface QuoteActionsProps {
  isSubmitting: boolean;
  onSaveQuote: () => void;
  onEditQuote: () => void;
}

export const QuoteActions: React.FC<QuoteActionsProps> = ({
  isSubmitting,
  onSaveQuote,
  onEditQuote
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Button 
        className="w-full"
        onClick={onSaveQuote}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement en cours...
          </>
        ) : (
          <>
            <DollarSignIcon className="mr-2 h-4 w-4" />
            Enregistrer ce devis
          </>
        )}
      </Button>
      <Button variant="outline" onClick={onEditQuote} className="w-full">
        Modifier le devis
      </Button>
    </div>
  );
};
