
import React, { useState } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import QuoteViewDialog from './QuoteViewDialog';
import { useToast } from '@/hooks/use-toast';
import { generateQuotePDF } from '@/utils/quotePDF';
import { Quote } from '@/types/quote';
import QuotesSearchBar from './search/QuotesSearchBar';
import QuotesFilter from './search/QuotesFilter';
import QuotesTable from './table/QuotesTable';

interface QuotesListProps {
  clientId?: string;
}

const QuotesList: React.FC<QuotesListProps> = ({ clientId }) => {
  const { quotes, isLoading, error, updateQuoteStatus, refetch } = useQuotes(clientId);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    });
  };

  const handleViewQuote = (quote: Quote) => {
    setViewQuote(quote);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewQuote(null);
  };

  const handleDownloadPDF = async (quote: Quote) => {
    try {
      const pdfBlob = await generateQuotePDF(quote);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${quote.id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF généré",
        description: "Le PDF du devis a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF du devis",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (quoteId: string, status: Quote['status']) => {
    updateQuoteStatus.mutate({ id: quoteId, status });
  };

  if (isLoading) {
    return <div className="py-10 text-center">Chargement des devis...</div>;
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="text-red-500 mb-4">Erreur: {error}</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="mb-4">Aucun devis trouvé.</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Rafraîchir
        </Button>
      </div>
    );
  }

  const filteredQuotes = quotes.filter(quote => {
    if (filter !== 'all' && quote.status !== filter) {
      return false;
    }
    
    if (searchTerm.trim() === '') {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const clientName = `${quote.clients?.first_name || ''} ${quote.clients?.last_name || ''}`.toLowerCase();
    const locations = `${quote.departure_location} ${quote.arrival_location}`.toLowerCase();
    
    return clientName.includes(searchLower) || locations.includes(searchLower);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <QuotesSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="icon" 
            className={refreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <QuotesFilter
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>

      <QuotesTable
        quotes={filteredQuotes}
        onViewQuote={handleViewQuote}
        onDownloadPDF={handleDownloadPDF}
        onStatusChange={handleStatusChange}
        isStatusUpdatePending={updateQuoteStatus.isPending}
      />

      <QuoteViewDialog 
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
        quote={viewQuote}
      />
    </div>
  );
};

export default QuotesList;
