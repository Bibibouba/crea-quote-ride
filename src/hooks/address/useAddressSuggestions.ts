
import { useState, useEffect } from 'react';
import { Address } from '@/hooks/useMapbox';

export const useAddressSuggestions = (
  query: string,
  searchAddresses: (query: string) => Promise<Address[]>,
  selectedAddress: Address | null
) => {
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      if (!selectedAddress || query !== selectedAddress.fullAddress) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, searchAddresses, selectedAddress]);

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions
  };
};
