
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quote } from '@/types/quote';

interface QuoteStatusSelectorProps {
  status: Quote['status'];
  onChange: (status: Quote['status']) => void;
  disabled?: boolean;
}

const QuoteStatusSelector: React.FC<QuoteStatusSelectorProps> = ({ 
  status, 
  onChange,
  disabled = false
}) => {
  return (
    <Select
      value={status}
      onValueChange={(value) => onChange(value as Quote['status'])}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Modifier le statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">En attente</SelectItem>
        <SelectItem value="accepted">Accepté</SelectItem>
        <SelectItem value="declined">Refusé</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default QuoteStatusSelector;
