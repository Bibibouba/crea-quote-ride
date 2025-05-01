
import React from 'react';
import { Input } from "@/components/ui/input";

interface QuotesSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const QuotesSearchBar = ({ searchTerm, onSearchChange }: QuotesSearchBarProps) => {
  return (
    <Input
      placeholder="Rechercher par client ou trajet..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full"
    />
  );
};

export default QuotesSearchBar;
