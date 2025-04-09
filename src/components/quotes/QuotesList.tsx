
import React, { useState } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import QuoteStatusBadge from './QuoteStatusBadge';
import QuoteStatusSelector from './QuoteStatusSelector';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
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

interface QuotesListProps {
  clientId?: string;
}

const QuotesList: React.FC<QuotesListProps> = ({ clientId }) => {
  const { quotes, isLoading, error, updateQuoteStatus } = useQuotes(clientId);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (isLoading) {
    return <div className="py-10 text-center">Chargement des devis...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">Erreur: {error}</div>;
  }

  if (quotes.length === 0) {
    return <div className="py-10 text-center">Aucun devis trouvé.</div>;
  }

  const handleStatusChange = (quoteId: string, status: Quote['status']) => {
    updateQuoteStatus.mutate({ id: quoteId, status });
  };

  const handleOpenPdf = (pdfUrl: string | null) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
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
    const clientName = `${quote.clients.first_name} ${quote.clients.last_name}`.toLowerCase();
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
        <div className="flex-none">
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
                  {quote.clients.first_name} {quote.clients.last_name}
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
                      disabled={!quote.quote_pdf}
                      onClick={() => handleOpenPdf(quote.quote_pdf)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Voir</span>
                    </Button>
                    <div className="hidden sm:block">
                      <QuoteStatusSelector
                        status={quote.status}
                        onChange={(status) => handleStatusChange(quote.id, status)}
                        disabled={updateQuoteStatus.isPending}
                      />
                    </div>
                    {quote.status === 'accepted' && (
                      <Button variant="outline" size="sm" className="hidden sm:flex">
                        <FileText className="h-4 w-4 mr-1" />
                        Facture
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuotesList;
