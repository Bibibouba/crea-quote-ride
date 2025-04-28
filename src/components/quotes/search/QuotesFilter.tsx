
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuotesFilterProps {
  filter: string;
  onFilterChange: (value: string) => void;
}

const QuotesFilter = ({ filter, onFilterChange }: QuotesFilterProps) => {
  return (
    <Select
      value={filter}
      onValueChange={onFilterChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les statuts</SelectItem>
        <SelectItem value="pending">En attente</SelectItem>
        <SelectItem value="accepted">Acceptés</SelectItem>
        <SelectItem value="declined">Refusés</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default QuotesFilter;
