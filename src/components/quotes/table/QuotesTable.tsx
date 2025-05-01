
import React from 'react';
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
import QuoteStatusBadge from '../QuoteStatusBadge';
import QuoteActions from '../actions/QuoteActions';
import { Quote } from '@/types/quote';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuotesTableProps {
  quotes: Quote[];
  onViewQuote: (quote: Quote) => void;
  onDownloadPDF: (quote: Quote) => void;
  onStatusChange: (quoteId: string, status: Quote['status']) => void;
  isStatusUpdatePending?: boolean;
}

const QuotesTable = ({
  quotes,
  onViewQuote,
  onDownloadPDF,
  onStatusChange,
  isStatusUpdatePending
}: QuotesTableProps) => {
  const isMobile = useIsMobile();

  return (
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
          {quotes.map((quote) => (
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
                <QuoteActions
                  quote={quote}
                  onViewQuote={onViewQuote}
                  onDownloadPDF={onDownloadPDF}
                  onStatusChange={onStatusChange}
                  isMobile={isMobile}
                  isStatusUpdatePending={isStatusUpdatePending}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuotesTable;
