
import React from 'react';
import { QuotesList } from '@/components/quotes/QuotesList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FilePlus } from 'lucide-react';

// Wrapper component to fix type issues
const TabWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div>{children}</div>
);

const QuotesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
          <p className="text-muted-foreground">
            Consultez et gérez vos devis clients
          </p>
        </div>
        <Button asChild className="shrink-0 self-start">
          <Link to="/dashboard/new-quote">
            <FilePlus className="h-4 w-4 mr-2" />
            <span>Nouveau devis</span>
          </Link>
        </Button>
      </div>

      <TabWrapper>
        <QuotesList />
      </TabWrapper>
    </div>
  );
};

export default QuotesPage;
