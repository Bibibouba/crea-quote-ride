
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPinIcon, XCircleIcon } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onClear: () => void;
  placeholder?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  required?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onFocus,
  onClear,
  placeholder,
  inputRef,
  required = false
}) => {
  return (
    <div className="relative">
      <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="pl-10 pr-10"
        autoComplete="off"
        required={required}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default AddressInput;
