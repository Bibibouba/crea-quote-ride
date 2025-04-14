
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import QuotesList from '@/components/quotes/QuotesList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuotes } from '@/hooks/useQuotes';
import { useToast } from '@/hooks/use-toast';

const Quotes = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');
  const { refetch, isLoading } = useQuotes(clientId || undefined);
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  // Force a refresh when the component mounts
  useEffect(() => {
    console.log('Quotes component mounted, performing initial refetch');
    refetch();
    
    // Set up a periodic refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Performing periodic refetch of quotes');
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => {
        toast({
          title: 'Données mises à jour',
          description: 'La liste des devis a été rafraîchie',
        });
      })
      .catch(error => {
        console.error('Error refreshing quotes:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de rafraîchir les données',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setTimeout(() => setRefreshing(false), 500);
      });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Historique des devis</h1>
            <p className="text-muted-foreground">
              {clientId 
                ? "Consultez les devis pour ce client spécifique." 
                : "Consultez et gérez tous vos devis envoyés."}
            </p>
          </div>
          
          <div className="flex gap-2">
            {clientId && (
              <Button variant="outline" asChild>
                <Link to="/dashboard/clients">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux clients
                </Link>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleManualRefresh}
              disabled={refreshing || isLoading}
              className={refreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button asChild>
              <Link to={clientId ? `/dashboard/quotes/new?client=${clientId}` : "/dashboard/quotes/new"}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau devis
              </Link>
            </Button>
          </div>
        </div>

        <QuotesList clientId={clientId || undefined} />
      </div>
    </DashboardLayout>
  );
};

export default Quotes;
