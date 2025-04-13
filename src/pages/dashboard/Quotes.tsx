
import React from 'react';
import QuotesList from '@/components/quotes/QuotesList';

const QuotesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
        <p className="text-muted-foreground">
          Gérez les demandes de devis de vos clients
        </p>
      </div>
      <QuotesList />
    </div>
  );
};

export default QuotesPage;
