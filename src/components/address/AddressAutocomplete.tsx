
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useMapbox, Address } from '@/hooks/useMapbox';
import AddressSuggestionsList from './AddressSuggestionsList';
import { useAddressSuggestions } from '@/hooks/address/useAddressSuggestions';
import { useAddressInteractions } from '@/hooks/address/useAddressInteractions';
import { useAddressState } from '@/hooks/address/useAddressState';
import AddressInput from './AddressInput';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const {
    query,
    selectedAddress,
    handleInputChange,
    handleSelectAddress,
    clearInput
  } = useAddressState(value, onChange, onSelect);

  const { suggestions, showSuggestions, setShowSuggestions } = useAddressSuggestions(
    query,
    searchAddresses,
    selectedAddress
  );

  useAddressInteractions(suggestionRef, inputRef, setShowSuggestions);

  const handleInputFocus = () => {
    if (!selectedAddress || query !== selectedAddress.fullAddress) {
      if (query.length >= 3 && suggestions.length > 0) {
        setShowSuggestions(true);
      }
    }
  };

  return (
    <div className={cn("space-y-2 relative", className)} ref={suggestionRef}>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      
      <AddressInput
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onClear={() => {
          clearInput();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
        placeholder={placeholder}
        inputRef={inputRef}
        required={required}
      />

      {showSuggestions && suggestions.length > 0 && (
        <AddressSuggestionsList
          suggestions={suggestions}
          onSelect={handleSelectAddress}
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
