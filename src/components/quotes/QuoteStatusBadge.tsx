
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Quote } from '@/types/quote';

interface QuoteStatusBadgeProps {
  status: Quote['status'];
}

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepté</Badge>;
    case 'declined':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Refusé</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

export default QuoteStatusBadge;
