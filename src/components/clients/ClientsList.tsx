
import React, { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { useQuotes } from '@/hooks/useQuotes';
import { Button } from '@/components/ui/button';
import { Eye, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuoteStatusBadge from '@/components/quotes/QuoteStatusBadge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ClientsList: React.FC = () => {
  const { clients, isLoading, error } = useClients();
  const { quotes } = useQuotes();
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Compute stats for each client
  const clientsWithStats = clients.map(client => {
    const clientQuotes = quotes.filter(q => q.client_id === client.id);
    const quoteCount = clientQuotes.length;
    
    let lastQuote = null;
    let lastStatus = null;
    
    if (quoteCount > 0) {
      // Sort by date (newest first) and get the first one
      const sortedQuotes = [...clientQuotes].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      lastQuote = sortedQuotes[0];
      lastStatus = lastQuote.status;
    }
    
    return {
      ...client,
      quoteCount,
      lastQuote,
      lastStatus,
    };
  });

  if (isLoading) {
    return <div className="py-10 text-center">Chargement des clients...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">Erreur: {error}</div>;
  }

  if (clients.length === 0) {
    return <div className="py-10 text-center">Aucun client trouvé.</div>;
  }

  const filteredClients = clientsWithStats.filter(client => {
    if (searchTerm.trim() === '') {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const email = client.email.toLowerCase();
    
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <div className="space-y-4">
      <div className="flex">
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Devis envoyés</TableHead>
              <TableHead>Dernier devis</TableHead>
              <TableHead>Dernier statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {client.first_name} {client.last_name}
                  </div>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell className="text-right">{client.quoteCount}</TableCell>
                <TableCell>
                  {client.lastQuote ? (
                    format(new Date(client.lastQuote.created_at), 'dd/MM/yyyy', { locale: fr })
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {client.lastStatus ? (
                    <QuoteStatusBadge status={client.lastStatus} />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link to={`/dashboard/quotes?client=${client.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir l'historique
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsList;
