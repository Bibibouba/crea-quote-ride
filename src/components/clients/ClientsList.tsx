import React, { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { useQuotes } from '@/hooks/useQuotes';
import { Button } from '@/components/ui/button';
import { Eye, User, Trash2, FileText } from 'lucide-react';
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import ClientDialog from './ClientDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClientsList: React.FC = () => {
  const { clients, isLoading, error, deleteClient } = useClients();
  const { quotes } = useQuotes();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);
  const [currentClientComments, setCurrentClientComments] = useState<{ id: string, name: string, comments: string | null }>({ id: '', name: '', comments: null });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{ id: string, name: string } | null>(null);

  const clientsWithStats = clients.map(client => {
    const clientQuotes = quotes.filter(q => q.client_id === client.id);
    const quoteCount = clientQuotes.length;
    
    let lastQuote = null;
    let lastStatus = null;
    
    if (quoteCount > 0) {
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

  const handleDeleteClick = (clientId: string, clientName: string) => {
    setClientToDelete({ id: clientId, name: clientName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient.mutateAsync(clientToDelete.id);
      toast.success(`Client supprimé avec succès`);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
      setDeleteDialogOpen(false);
    }
  };
  
  const showClientComments = (client: any) => {
    setCurrentClientComments({
      id: client.id,
      name: `${client.first_name} ${client.last_name}`,
      comments: client.comments
    });
    setIsCommentsDialogOpen(true);
  };

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
      <div className="flex justify-between">
        <Input
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <ClientDialog buttonText="Ajouter un client" />
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
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/dashboard/quotes?client=${client.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                    </Button>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => showClientComments(client)}
                            disabled={!client.comments}
                          >
                            <FileText className={`h-4 w-4 ${client.comments ? 'text-blue-500' : 'text-gray-300'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Voir les commentaires</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <ClientDialog 
                      initialData={client} 
                      buttonText="" 
                      buttonVariant="ghost"
                    />
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(client.id, `${client.first_name} ${client.last_name}`)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer le client</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commentaires - {currentClientComments.name}</DialogTitle>
            <DialogDescription>
              Notes et commentaires sur ce client
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {currentClientComments.comments ? (
              <p className="whitespace-pre-line">{currentClientComments.comments}</p>
            ) : (
              <p className="text-muted-foreground italic">Aucun commentaire</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le client
              <span className="font-semibold"> {clientToDelete?.name}</span>.
              <br /><br />
              <span className="text-amber-500 font-medium">Note:</span> Si ce client a des devis associés, ces devis seront conservés dans le système mais ne seront plus liés à un client existant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsList;
