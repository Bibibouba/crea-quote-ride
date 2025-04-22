
import React, { useState, useEffect } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import QuoteStatusBadge from './QuoteStatusBadge';
import QuoteStatusSelector from './QuoteStatusSelector';
import { Button } from '@/components/ui/button';
import { Eye, FileText, RefreshCw, Download, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Quote } from '@/types/quote';
import QuoteViewDialog from './QuoteViewDialog';
import { useToast } from '@/hooks/use-toast';
import { generateQuotePDF } from '@/utils/quotePDF';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

interface QuotesListProps {
  clientId?: string;
}

const QuotesList: React.FC<QuotesListProps> = ({ clientId }) => {
  const { quotes, isLoading, error, updateQuoteStatus, refetch } = useQuotes(clientId);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Force initial data fetching
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Helper function to handle manual refresh
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
      
      // Create a download link
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
    setSelectedQuote(null); // Close sheet after status change on mobile
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

  const handleOpenPdf = (pdfUrl: string | null) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const openQuoteActions = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const filteredQuotes = quotes.filter(quote => {
    // First apply status filter
    if (filter !== 'all' && quote.status !== filter) {
      return false;
    }
    
    // Then apply search term if present
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
          <Input
            placeholder="Rechercher par client ou trajet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
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
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="accepted">Acceptés</SelectItem>
              <SelectItem value="declined">Refusés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Date du trajet</TableHead>
              <TableHead>Trajet</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">
                  {quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : 'Client inconnu'}
                </TableCell>
                <TableCell>
                  {format(new Date(quote.ride_date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">De:</span>
                    <span className="truncate max-w-[150px]">{quote.departure_location}</span>
                    <span className="text-xs text-muted-foreground mt-1">À:</span>
                    <span className="truncate max-w-[150px]">{quote.arrival_location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {quote.vehicles ? quote.vehicles.name : "N/A"}
                </TableCell>
                <TableCell>
                  {quote.amount.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </TableCell>
                <TableCell>
                  <QuoteStatusBadge status={quote.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewQuote(quote)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Voir</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadPDF(quote)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">PDF</span>
                    </Button>
                    
                    {isMobile ? (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openQuoteActions(quote)}
                          >
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
                              onChange={(status) => handleStatusChange(quote.id, status)}
                              disabled={updateQuoteStatus.isPending}
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
                          onChange={(status) => handleStatusChange(quote.id, status)}
                          disabled={updateQuoteStatus.isPending}
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuoteViewDialog 
        isOpen={isViewDialogOpen}
        onClose={handleCloseViewDialog}
        quote={viewQuote}
      />
    </div>
  );
};

export default QuotesList;
