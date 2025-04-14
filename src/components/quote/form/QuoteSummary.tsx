
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSignIcon, Loader2, Clock, Moon } from 'lucide-react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import RouteMap from '@/components/map/RouteMap';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { formatDuration } from '@/lib/formatDuration';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/quoteForm';

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
  vehicles: Vehicle[];
  hasReturnTrip?: boolean;
  hasWaitingTime?: boolean;
  waitingTimeMinutes?: number;
  waitingTimePrice?: number;
  returnToSameAddress?: boolean;
  customReturnAddress?: string;
  returnDistance?: number;
  returnDuration?: number;
  returnCoordinates?: [number, number] | undefined;
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
  waitingTimePrice = 0,
  returnToSameAddress = true,
  customReturnAddress = '',
  returnDistance = 0,
  returnDuration = 0,
  returnCoordinates
}) => {
  const isMobile = useIsMobile();
  
  // Calculate the return price if applicable
  const returnPrice = hasReturnTrip ? (returnToSameAddress ? estimatedPrice : Math.round(returnDistance * basePrice)) : 0;
  
  // Calculate the total price including waiting time and return trip
  const totalPrice = estimatedPrice + (hasWaitingTime ? waitingTimePrice : 0) + returnPrice;
  
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

  // Format price with one decimal
  const formatPrice = (price: number) => {
    return price.toFixed(1);
  };
  
  // Get night rate details from the selected vehicle
  const selectedVehicleObj = vehicles.find(v => v.id === selectedVehicle);
  const hasNightRate = selectedVehicleObj?.night_rate_enabled || false;
  const nightRatePercentage = selectedVehicleObj?.night_rate_percentage || 0;
  const nightRateStart = selectedVehicleObj?.night_rate_start || '20:00';
  const nightRateEnd = selectedVehicleObj?.night_rate_end || '06:00';
  
  // Determine if the ride has a night portion based on time
  const [hours, minutes] = time.split(':').map(Number);
  const rideTime = new Date(date);
  rideTime.setHours(hours, minutes);
  
  const nightStartTime = new Date(date);
  const [nightStartHours, nightStartMinutes] = nightRateStart?.split(':').map(Number) || [0, 0];
  nightStartTime.setHours(nightStartHours, nightStartMinutes);
  
  const nightEndTime = new Date(date);
  const [nightEndHours, nightEndMinutes] = nightRateEnd?.split(':').map(Number) || [0, 0];
  nightEndTime.setHours(nightEndHours, nightEndMinutes);
  
  // Check if the ride has a night portion
  const isNightRateApplied = hasNightRate && (
    (nightStartTime > nightEndTime && (rideTime >= nightStartTime || rideTime <= nightEndTime)) ||
    (nightStartTime < nightEndTime && rideTime >= nightStartTime && rideTime <= nightEndTime)
  );
  
  return (
    <div className="space-y-6">
      <div className="bg-secondary/30 p-4 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="w-full sm:w-1/2">
            <p className="text-sm font-medium">Départ</p>
            <p className="text-sm text-muted-foreground break-words">{departureAddress}</p>
          </div>
          <div className="w-full sm:w-1/2 sm:text-right">
            <p className="text-sm font-medium">Destination</p>
            <p className="text-sm text-muted-foreground break-words">{destinationAddress}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-4 gap-4">
          <div>
            <p className="text-sm font-medium">Distance estimée</p>
            <p className="text-sm text-muted-foreground">{estimatedDistance} km</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-medium">Durée estimée</p>
            <p className="text-sm text-muted-foreground">{formatDuration(estimatedDuration)}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] rounded-lg overflow-hidden border">
          <RouteMap
            departure={departureCoordinates}
            destination={destinationCoordinates}
          />
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
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
              
              {/* Trajet aller */}
              <div className="flex justify-between">
                <div className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="font-medium">Trajet aller</p>
                </div>
                <p>{formatPrice(estimatedPrice)}€</p>
              </div>
              
              {/* Afficher les infos de tarif de nuit si applicable */}
              {hasNightRate && isNightRateApplied && (
                <div className="ml-6 bg-muted/40 p-2 rounded-md">
                  <div className="flex items-center mb-1">
                    <Moon className="h-3 w-3 mr-1 text-amber-500" />
                    <p className="text-xs font-medium">Tarif de nuit ({nightRatePercentage}% de majoration)</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cette course débute à {time} et peut inclure une portion en tarif de nuit 
                    (entre {nightRateStart} et {nightRateEnd}).
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    La majoration s'applique uniquement à la portion du trajet effectuée pendant ces horaires.
                  </p>
                </div>
              )}
              
              {/* Display waiting time information */}
              {hasWaitingTime && (
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="font-medium">Temps d'attente ({formatWaitingTime(waitingTimeMinutes || 0)})</p>
                  </div>
                  <p>{formatPrice(waitingTimePrice || 0)}€</p>
                </div>
              )}
              
              {/* Display return trip information */}
              {hasReturnTrip && (
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="font-medium">
                      Trajet retour {returnToSameAddress ? '(même adresse)' : ''}
                    </p>
                  </div>
                  <p>{formatPrice(returnPrice)}€</p>
                </div>
              )}
              
              {/* Display custom return address if applicable */}
              {hasReturnTrip && !returnToSameAddress && customReturnAddress && (
                <div className="text-sm text-muted-foreground">
                  <p className="break-words">Adresse de retour : {customReturnAddress}</p>
                  {returnDistance > 0 && (
                    <p className="mt-1">Distance : {returnDistance} km | Durée : {formatDuration(returnDuration || 0)}</p>
                  )}
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between border-t border-border/60 pt-4">
                <p className="font-medium">Montant total</p>
                <p className="text-xl font-bold">{formatPrice(totalPrice)}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showClientInfo && clientInfoComponent}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Button variant="outline" onClick={onEditQuote} className="w-full">
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
