
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ClientType } from '@/types/client';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ClientTypeSelectorProps {
  clientType: ClientType;
  onClientTypeChange: (type: ClientType) => void;
}

const clientTypes: Array<{value: ClientType; label: string; description: string}> = [
  {
    value: 'personal',
    label: 'Particulier',
    description: 'Clients particuliers pour des transferts privés'
  },
  {
    value: 'business',
    label: 'Entreprise',
    description: 'Entreprises pour des déplacements professionnels'
  },
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Grands comptes avec contrats spécifiques'
  }
];

const ClientTypeSelector = ({ clientType, onClientTypeChange }: ClientTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label>Type de client</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clientTypes.map((type) => (
          <div
            key={type.value}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-colors",
              clientType === type.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onClientTypeChange(type.value)}
          >
            <h3 className="font-medium">{type.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientTypeSelector;
