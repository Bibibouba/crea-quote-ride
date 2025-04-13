
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import QuotesList from '@/components/quotes/QuotesList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quotes = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');

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
          
          {clientId && (
            <Button variant="outline" asChild>
              <Link to="/dashboard/clients">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux clients
              </Link>
            </Button>
          )}
        </div>

        <QuotesList clientId={clientId || undefined} />
      </div>
    </DashboardLayout>
  );
};

export default Quotes;
