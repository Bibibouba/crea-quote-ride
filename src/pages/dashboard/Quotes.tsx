
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import QuotesList from '@/components/quotes/QuotesList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuotes } from '@/hooks/useQuotes';

const Quotes = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');
  const { refetch } = useQuotes(clientId || undefined);

  // Force a refresh when the component mounts
  useEffect(() => {
    refetch();
    
    // Set up a periodic refresh every 30 seconds
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

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
