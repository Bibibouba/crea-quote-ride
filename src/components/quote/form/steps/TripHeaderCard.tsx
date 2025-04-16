
import React from 'react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftRight } from 'lucide-react';

interface TripHeaderCardProps {
  departureAddress: string;
  destinationAddress: string;
  customReturnAddress: string;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  date?: Date;
  time: string;
  selectedVehicleInfo: any;
  passengers: string;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
}

export const TripHeaderCard: React.FC<TripHeaderCardProps> = ({
  departureAddress,
  destinationAddress,
  customReturnAddress,
  hasReturnTrip,
  returnToSameAddress,
  date,
  time,
  selectedVehicleInfo,
  passengers,
  hasWaitingTime,
  waitingTimeMinutes
}) => {
  return (
    <div className="rounded-lg border bg-card p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="font-medium mb-1">Départ</p>
          <p className="text-sm text-muted-foreground break-words">{departureAddress || "Non spécifié"}</p>
        </div>
        <div>
          <p className="font-medium mb-1">Destination</p>
          <p className="text-sm text-muted-foreground break-words">{destinationAddress || "Non spécifié"}</p>
        </div>
      </div>
      
      {hasReturnTrip && !returnToSameAddress && (
        <div className="mt-4">
          <p className="font-medium mb-1">Adresse de retour</p>
          <p className="text-sm text-muted-foreground break-words">{customReturnAddress || "Non spécifiée"}</p>
        </div>
      )}
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Date</p>
          <p className="text-sm font-medium">{date ? format(date, 'dd/MM/yyyy') : "Non spécifiée"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Heure</p>
          <p className="text-sm font-medium">{time || "Non spécifiée"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Véhicule</p>
          <p className="text-sm font-medium">
            {selectedVehicleInfo?.name || "Non spécifié"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Passagers</p>
          <div className="flex items-center gap-1 text-sm font-medium">
            <span>{passengers}</span>
            {selectedVehicleInfo && (
              <span className="text-xs text-muted-foreground">
                (capacité: {selectedVehicleInfo.capacity})
              </span>
            )}
          </div>
        </div>
      </div>
      
      {hasReturnTrip && (
        <div className="mt-4 p-2 bg-secondary/30 rounded-md">
          <div className="flex items-center">
            <ArrowLeftRight className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium">Aller-retour avec {hasWaitingTime ? `attente de ${waitingTimeMinutes} minutes` : 'retour immédiat'}</p>
          </div>
        </div>
      )}
    </div>
  );
};
