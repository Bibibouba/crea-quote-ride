
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPinIcon, XCircleIcon } from 'lucide-react';
import { useMapbox, Address } from '@/hooks/useMapbox';
import { cn } from '@/lib/utils';

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
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const suggestionRef = useRef<HTMLUListElement>(null);

  // Mettre à jour le query si la valeur change de l'extérieur
  useEffect(() => {
    if (value !== query && !selectedAddress) {
      setQuery(value);
    }
  }, [value]);

  // Effectuer la recherche lorsque query change
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 3) {
        const results = await searchAddresses(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, searchAddresses]);

  // Fermer les suggestions si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onChange(value);
    
    // Si l'utilisateur efface le champ, on réinitialise l'adresse sélectionnée
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

  const clearInput = () => {
    setQuery('');
    onChange('');
    setSelectedAddress(null);
    if (onSelect) onSelect({
      id: '',
      name: '',
      fullAddress: '',
      coordinates: [0, 0]
    });
  };

  return (
    <div className={cn("space-y-2 relative", className)}>
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <div className="relative">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
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
        <ul
          ref={suggestionRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-card border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="relative cursor-pointer select-none py-2 px-4 hover:bg-secondary"
            >
              <div className="font-medium">{suggestion.name}</div>
              <div className="text-xs text-muted-foreground">{suggestion.fullAddress}</div>
            </li>
          ))}
        </ul>
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
