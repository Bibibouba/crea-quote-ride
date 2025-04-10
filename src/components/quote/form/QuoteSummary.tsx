
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSignIcon, Loader2 } from 'lucide-react';
import RouteMap from '@/components/map/RouteMap';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface QuoteSummaryProps {
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
  date: Date;
  time: string;
  estimatedDistance: number;
  estimatedDuration: number;
  selectedVehicle: string;
  passengers: string;
  basePrice: number;
  estimatedPrice: number;
  isSubmitting: boolean;
  onSaveQuote: () => void;
  onEditQuote: () => void;
  showClientInfo: boolean;
  clientInfoComponent?: React.ReactNode;
  vehicles: Array<{ id: string; name: string; basePrice: number; description: string }>;
  hasReturnTrip?: boolean;
  hasWaitingTime?: boolean;
  waitingTimeMinutes?: number;
  waitingTimePrice?: number;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  departureAddress,
  destinationAddress,
  departureCoordinates,
  destinationCoordinates,
  date,
  time,
  estimatedDistance,
  estimatedDuration,
  selectedVehicle,
  passengers,
  basePrice,
  estimatedPrice,
  isSubmitting,
  onSaveQuote,
  onEditQuote,
  showClientInfo,
  clientInfoComponent,
  vehicles,
  hasReturnTrip = false,
  hasWaitingTime = false,
  waitingTimeMinutes = 0,
  waitingTimePrice = 0
}) => {
  // Calculate the total price including waiting time
  const totalPrice = hasWaitingTime ? estimatedPrice + waitingTimePrice : estimatedPrice;
  
  // Format waiting time for display
  const formatWaitingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-secondary p-4 rounded-lg space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium">Départ</p>
            <p className="text-sm text-muted-foreground">{departureAddress}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Destination</p>
            <p className="text-sm text-muted-foreground">{destinationAddress}</p>
          </div>
        </div>
        <div className="flex justify-between border-t pt-4">
          <div>
            <p className="text-sm font-medium">Distance estimée</p>
            <p className="text-sm text-muted-foreground">{estimatedDistance} km</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Durée estimée</p>
            <p className="text-sm text-muted-foreground">{estimatedDuration} minutes</p>
          </div>
        </div>
      </div>
      
      <div className="w-full h-64">
        <RouteMap
          departure={departureCoordinates}
          destination={destinationCoordinates}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium">Véhicule sélectionné</p>
          <p>{vehicles.find(v => v.id === selectedVehicle)?.name || "Berline"}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Nombre de passagers</p>
          <p>{passengers} {parseInt(passengers) === 1 ? 'passager' : 'passagers'}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Prix au kilomètre</p>
          <p>{basePrice.toFixed(2)}€/km</p>
        </div>
        
        {/* Display option for return trip */}
        {hasReturnTrip && (
          <div className="flex justify-between">
            <p className="font-medium">Option aller-retour</p>
            <p>Oui</p>
          </div>
        )}
        
        {/* Display waiting time information */}
        {hasWaitingTime && (
          <>
            <div className="flex justify-between">
              <p className="font-medium">Temps d'attente</p>
              <p>{formatWaitingTime(waitingTimeMinutes)}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Prix du temps d'attente</p>
              <p>{waitingTimePrice}€</p>
            </div>
          </>
        )}
        
        <Separator className="my-2" />
        
        <div className="flex justify-between border-t border-border/60 pt-4">
          <p className="font-medium">Montant total</p>
          <p className="text-xl font-bold">{totalPrice}€</p>
        </div>
      </div>
      
      {showClientInfo && clientInfoComponent}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className="w-full"
          onClick={onSaveQuote}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement en cours...
            </>
          ) : (
            <>
              <DollarSignIcon className="mr-2 h-4 w-4" />
              Enregistrer ce devis
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onEditQuote}>
          Modifier le devis
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        * Ce montant est une estimation et peut varier en fonction des conditions réelles de circulation
      </p>
    </div>
  );
};

export default QuoteSummary;
