
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building2 } from 'lucide-react';
import { ClientType } from '@/types/client';

interface ClientTypeSelectorProps {
  clientType: ClientType;
  onClientTypeChange: (type: ClientType) => void;
}

const ClientTypeSelector: React.FC<ClientTypeSelectorProps> = ({
  clientType,
  onClientTypeChange
}) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Button
        type="button"
        variant={clientType === 'personal' ? 'default' : 'outline'}
        className={`flex-1 py-6 ${clientType === 'personal' ? 'shadow-md border-primary/50' : ''}`}
        onClick={() => onClientTypeChange('personal')}
      >
        <User className="mr-2 h-4 w-4" />
        Particulier
      </Button>
      <Button
        type="button"
        variant={clientType === 'company' ? 'default' : 'outline'}
        className={`flex-1 py-6 ${clientType === 'company' ? 'shadow-md border-primary/50' : ''}`}
        onClick={() => onClientTypeChange('company')}
      >
        <Building2 className="mr-2 h-4 w-4" />
        Société
      </Button>
    </div>
  );
};

export default ClientTypeSelector;
