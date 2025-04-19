
import { useState } from 'react';
import { Address } from '@/hooks/useMapbox';

export const useAddressState = (
  initialValue: string,
  onChange: (address: string) => void,
  onSelect?: (address: Address) => void
) => {
  const [query, setQuery] = useState(initialValue);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleInputChange = (value: string) => {
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

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setQuery(address.fullAddress);
    onChange(address.fullAddress);
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

  return {
    query,
    selectedAddress,
    handleInputChange,
    handleSelectAddress,
    clearInput
  };
};
