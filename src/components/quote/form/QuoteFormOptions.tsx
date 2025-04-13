
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import { Address } from '@/hooks/useMapbox';
import { WaitingTimeOption } from '@/hooks/useQuoteForm';

interface QuoteFormOptionsProps {
  hasReturnTrip: boolean;
  setHasReturnTrip: (value: boolean) => void;
  hasWaitingTime: boolean;
  setHasWaitingTime: (value: boolean) => void;
  waitingTimeMinutes: number;
  setWaitingTimeMinutes: (value: number) => void;
  waitingTimePrice: number;
  waitingTimeOptions: WaitingTimeOption[];
  returnToSameAddress: boolean;
  setReturnToSameAddress: (value: boolean) => void;
  customReturnAddress: string;
  setCustomReturnAddress: (value: string) => void;
  handleReturnAddressSelect: (address: Address) => void;
}

const QuoteFormOptions: React.FC<QuoteFormOptionsProps> = ({
  hasReturnTrip,
  setHasReturnTrip,
  hasWaitingTime,
  setHasWaitingTime,
  waitingTimeMinutes,
  setWaitingTimeMinutes,
  waitingTimePrice,
  waitingTimeOptions,
  returnToSameAddress,
  setReturnToSameAddress,
  customReturnAddress,
  setCustomReturnAddress,
  handleReturnAddressSelect
}) => {
  return (
    <div className="space-y-4 border rounded-md p-4 bg-secondary/20">
      <h3 className="font-medium mb-2">Options supplémentaires</h3>
      
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="return-trip" className="font-medium">Aller-retour</Label>
          <p className="text-sm text-muted-foreground">Souhaitez-vous prévoir un trajet retour ?</p>
        </div>
        <Switch 
          id="return-trip" 
          checked={hasReturnTrip} 
          onCheckedChange={setHasReturnTrip} 
        />
      </div>
      
      {hasReturnTrip && (
        <>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="waiting-time" className="font-medium">Temps d'attente</Label>
              <p className="text-sm text-muted-foreground">Le chauffeur doit-il vous attendre (rendez-vous médical, etc) ?</p>
            </div>
            <Switch 
              id="waiting-time" 
              checked={hasWaitingTime} 
              onCheckedChange={setHasWaitingTime}
            />
          </div>
          
          {hasWaitingTime && (
            <div className="pt-2">
              <Label htmlFor="waiting-duration" className="font-medium">Durée d'attente estimée</Label>
              <Select
                value={waitingTimeMinutes.toString()}
                onValueChange={(value) => setWaitingTimeMinutes(parseInt(value))}
              >
                <SelectTrigger id="waiting-duration" className="mt-1.5">
                  <SelectValue placeholder="Sélectionnez une durée" />
                </SelectTrigger>
                <SelectContent>
                  {waitingTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {waitingTimePrice > 0 && (
                <p className="text-sm mt-2">
                  Prix du temps d'attente: <span className="font-medium">{waitingTimePrice}€</span>
                </p>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between space-x-2 pt-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="same-address" className="font-medium">Retour à la même adresse</Label>
              <p className="text-sm text-muted-foreground">Souhaitez-vous être redéposé à la même adresse qu'à l'aller ?</p>
            </div>
            <Switch 
              id="same-address" 
              checked={returnToSameAddress} 
              onCheckedChange={setReturnToSameAddress}
            />
          </div>
          
          {!returnToSameAddress && (
            <div className="pt-2">
              <AddressAutocomplete
                label="Adresse de retour"
                placeholder="Saisissez l'adresse de retour"
                value={customReturnAddress}
                onChange={setCustomReturnAddress}
                onSelect={handleReturnAddressSelect}
                required
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuoteFormOptions;
