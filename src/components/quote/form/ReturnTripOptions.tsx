
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import { Address } from '@/hooks/useMapbox';
import WaitingTimeSelector from './WaitingTimeSelector';
import { WaitingTimeOption } from '@/hooks/useQuoteForm';

interface ReturnTripOptionsProps {
  hasReturnTrip: boolean;
  setHasReturnTrip: (hasReturn: boolean) => void;
  hasWaitingTime: boolean;
  setHasWaitingTime: (hasWaiting: boolean) => void;
  waitingTimeMinutes: number;
  setWaitingTimeMinutes: (minutes: number) => void;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  setReturnToSameAddress: (returnToSame: boolean) => void;
  customReturnAddress: string;
  setCustomReturnAddress: (address: string) => void;
  waitingTimeOptions: WaitingTimeOption[];
  handleReturnAddressSelect: (address: Address) => void;
}

const ReturnTripOptions: React.FC<ReturnTripOptionsProps> = ({
  hasReturnTrip,
  setHasReturnTrip,
  hasWaitingTime,
  setHasWaitingTime,
  waitingTimeMinutes,
  setWaitingTimeMinutes,
  waitingTimePrice,
  returnToSameAddress,
  setReturnToSameAddress,
  customReturnAddress,
  setCustomReturnAddress,
  waitingTimeOptions,
  handleReturnAddressSelect
}) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="return-trip" className="cursor-pointer">Voyage retour</Label>
          <Switch
            id="return-trip"
            checked={hasReturnTrip}
            onCheckedChange={setHasReturnTrip}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="waiting-time" className="cursor-pointer">Temps d'attente</Label>
          <Switch
            id="waiting-time"
            checked={hasWaitingTime}
            onCheckedChange={setHasWaitingTime}
          />
        </div>
      </div>
      
      {/* Sélecteur de temps d'attente */}
      {hasWaitingTime && (
        <WaitingTimeSelector
          waitingTimeMinutes={waitingTimeMinutes}
          setWaitingTimeMinutes={setWaitingTimeMinutes}
          waitingTimeOptions={waitingTimeOptions}
          waitingTimePrice={waitingTimePrice}
        />
      )}
      
      {/* Adresse de retour */}
      {hasReturnTrip && (
        <div className="space-y-3 p-3 bg-muted/20 rounded-md">
          <div className="flex items-center justify-between">
            <Label htmlFor="return-to-same" className="cursor-pointer">
              Retour à l'adresse de départ
            </Label>
            <Switch
              id="return-to-same"
              checked={returnToSameAddress}
              onCheckedChange={setReturnToSameAddress}
            />
          </div>
          
          {!returnToSameAddress && (
            <AddressAutocomplete
              label="Adresse de retour personnalisée"
              placeholder="Saisissez l'adresse de retour"
              value={customReturnAddress}
              onChange={setCustomReturnAddress}
              onSelect={handleReturnAddressSelect}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnTripOptions;
