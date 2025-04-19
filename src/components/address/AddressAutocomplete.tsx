
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPinIcon, XCircleIcon } from 'lucide-react';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { cn } from '@/lib/utils';
import AddressSuggestionsList from './AddressSuggestionsList';
import { useAddressSuggestions } from '@/hooks/address/useAddressSuggestions';
import { useAddressInteractions } from '@/hooks/address/useAddressInteractions';

interface AddressAutocompleteProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (address: string) => void;
  onSelect?: (address: Address) => void;
  className?: string;
  required?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  placeholder = "Saisissez une adresse",
  value,
  onChange,
  onSelect,
  className,
  required = false
}) => {
  const { searchAddresses, isLoading } = useMapbox();
  const [query, setQuery] = useState(value);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const { suggestions, showSuggestions, setShowSuggestions } = useAddressSuggestions(
    query,
    searchAddresses,
    selectedAddress
  );

  useAddressInteractions(suggestionRef, inputRef, setShowSuggestions);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onChange(value);
    
    if (selectedAddress && value !== selectedAddress.fullAddress) {
      setSelectedAddress(null);
    }
    
    if (!value) {
      setSelectedAddress(null);
      if (onSelect) onSelect({
        id: '',
        name: '',
        fullAddress: '',
        coordinates: [0, 0]
      });
    }
  };

  const handleSelectSuggestion = (address: Address) => {
    setSelectedAddress(address);
    setQuery(address.fullAddress);
    onChange(address.fullAddress);
    setShowSuggestions(false);
    if (onSelect) onSelect(address);
  };

  const handleInputFocus = () => {
    if (!selectedAddress || query !== selectedAddress.fullAddress) {
      if (query.length >= 3 && suggestions.length > 0) {
        setShowSuggestions(true);
      }
    }
  };

  const clearInput = () => {
    setQuery('');
    onChange('');
    setSelectedAddress(null);
    setShowSuggestions(false);
    if (onSelect) onSelect({
      id: '',
      name: '',
      fullAddress: '',
      coordinates: [0, 0]
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("space-y-2 relative", className)} ref={suggestionRef}>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <div className="relative">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pl-10 pr-10"
          autoComplete="off"
          required={required}
        />
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <AddressSuggestionsList
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
        />
      )}

      {isLoading && query.length >= 3 && suggestions.length === 0 && (
        <div className="text-xs text-muted-foreground pt-1">
          Recherche en cours...
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
