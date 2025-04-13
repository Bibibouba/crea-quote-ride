
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Ban, Clock, CalendarCheck, X } from 'lucide-react';
import { QuoteStatus } from '@/types/quote';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

const QuoteStatusBadge = ({ status }: QuoteStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { icon: Clock, variant: 'outline', text: 'En attente' };
      case 'accepted':
        return { icon: Check, variant: 'success', text: 'Accepté' };
      case 'rejected':
      case 'declined':
        return { icon: Ban, variant: 'destructive', text: 'Refusé' };
      case 'completed':
        return { icon: CalendarCheck, variant: 'default', text: 'Terminé' };
      case 'cancelled':
        return { icon: X, variant: 'secondary', text: 'Annulé' };
      default:
        return { icon: Clock, variant: 'outline', text: 'Inconnu' };
    }
  };

  const { icon: Icon, variant, text } = getStatusConfig();

  return (
    <Badge variant={variant as any} className="gap-1 font-normal">
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </Badge>
  );
};

export default QuoteStatusBadge;
