
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Address } from '@/hooks/useMapbox';

interface AddressSuggestionsListProps {
  suggestions: Address[];
  onSelect: (suggestion: Address) => void;
}

const AddressSuggestionsList = ({ suggestions, onSelect }: AddressSuggestionsListProps) => {
  return (
    <div 
      className="absolute z-50 mt-1 w-full rounded-md bg-card border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      style={{ maxHeight: '240px', overflow: 'hidden' }}
    >
      <ScrollArea className="max-h-60 w-full">
        <ul className="text-sm py-2">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => onSelect(suggestion)}
              className="relative cursor-pointer select-none py-2 px-4 hover:bg-secondary"
            >
              <div className="font-medium">{suggestion.name}</div>
              <div className="text-xs text-muted-foreground">{suggestion.fullAddress}</div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default AddressSuggestionsList;
