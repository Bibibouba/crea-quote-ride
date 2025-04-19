
import { useEffect } from 'react';
import { Address } from '@/hooks/useMapbox';

export const useAddressInteractions = (
  suggestionRef: React.RefObject<HTMLDivElement>,  
  inputRef: React.RefObject<HTMLInputElement>,
  setShowSuggestions: (show: boolean) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionRef, inputRef, setShowSuggestions]);
};
