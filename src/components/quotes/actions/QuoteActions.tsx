
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Download, Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import QuoteStatusSelector from '../QuoteStatusSelector';
import { Quote } from '@/types/quote';

interface QuoteActionsProps {
  quote: Quote;
  onViewQuote: (quote: Quote) => void;
  onDownloadPDF: (quote: Quote) => void;
  onStatusChange: (quoteId: string, status: Quote['status']) => void;
  isMobile: boolean;
  isStatusUpdatePending?: boolean;
}

const QuoteActions = ({
  quote,
  onViewQuote,
  onDownloadPDF,
  onStatusChange,
  isMobile,
  isStatusUpdatePending
}: QuoteActionsProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onViewQuote(quote)}
      >
        <Eye className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Voir</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onDownloadPDF(quote)}
      >
        <Download className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Changer le statut du devis</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <QuoteStatusSelector
                status={quote.status}
                onChange={(status) => onStatusChange(quote.id, status)}
                disabled={isStatusUpdatePending}
              />
            </div>
            <div className="flex justify-end">
              <SheetClose asChild>
                <Button variant="outline">Fermer</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden sm:block">
          <QuoteStatusSelector
            status={quote.status}
            onChange={(status) => onStatusChange(quote.id, status)}
            disabled={isStatusUpdatePending}
          />
        </div>
      )}
    </div>
  );
};

export default QuoteActions;
