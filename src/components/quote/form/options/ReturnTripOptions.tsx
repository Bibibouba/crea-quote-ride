
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AddressAutocomplete from '@/components/address/AddressAutocomplete';
import { Address } from '@/hooks/useMapbox';

interface ReturnTripOptionsProps {
  hasReturnTrip: boolean;
  setHasReturnTrip: (b: boolean) => void;
  returnToSameAddress: boolean;
  setReturnToSameAddress: (b: boolean) => void;
  customReturnAddress: string;
  setCustomReturnAddress: (addr: string) => void;
  handleReturnAddressSelect: (address: Address) => void;
}

export const ReturnTripOptions: React.FC<ReturnTripOptionsProps> = ({
  hasReturnTrip,
  setHasReturnTrip,
  returnToSameAddress,
  setReturnToSameAddress,
  customReturnAddress,
  setCustomReturnAddress,
  handleReturnAddressSelect
}) => {
  return (
    <div className="space-y-4">
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
