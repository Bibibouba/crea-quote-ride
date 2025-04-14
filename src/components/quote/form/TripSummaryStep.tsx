
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeftRight, ArrowRight, ArrowLeft, Users, Moon, Calendar, InfoIcon } from 'lucide-react';
import RouteMap from '@/components/map/RouteMap';
import { formatDuration } from '@/lib/formatDuration';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface TripSummaryStepProps {
  departureAddress: string;
  destinationAddress: string;
  customReturnAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date?: Date;
  time: string;
  selectedVehicle: string;
  passengers: string;
  estimatedDistance: number;
  estimatedDuration: number;
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  returnToSameAddress: boolean;
  returnDistance: number;
  returnDuration: number;
  customReturnCoordinates?: [number, number];
  quoteDetails: any;
  vehicles: any[];
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

const TripSummaryStep: React.FC<TripSummaryStepProps> = ({
  departureAddress,
  destinationAddress,
  customReturnAddress,
  departureCoordinates,
  destinationCoordinates,
  date,
  time,
  selectedVehicle,
  passengers,
  estimatedDistance,
  estimatedDuration,
  hasReturnTrip,
  hasWaitingTime,
  waitingTimeMinutes,
  returnToSameAddress,
  returnDistance,
  returnDuration,
  customReturnCoordinates,
  quoteDetails,
  vehicles,
  handleRouteCalculated,
  handleNextStep,
  handlePreviousStep
}) => {
  const selectedVehicleInfo = vehicles.find(v => v.id === selectedVehicle);
  const isNightRate = quoteDetails?.isNightRate;
  const isSunday = quoteDetails?.isSunday;
  
  // Formatter pour afficher un chiffre après la virgule
  const formatPrice = (price?: number) => {
    if (price === undefined) return "0.0";
    return price.toFixed(1);
  };
  
  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] rounded-lg border overflow-hidden">
          {departureCoordinates && destinationCoordinates ? (
            <RouteMap
              departure={departureCoordinates}
              destination={destinationCoordinates}
              onRouteCalculated={handleRouteCalculated}
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center p-4 bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Carte du trajet</p>
              <p className="text-xs">Sélectionnez des adresses valides pour afficher l'itinéraire</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium mb-3">Détails du trajet</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Distance estimée (aller)</p>
                <p className="text-sm font-medium">{estimatedDistance} km</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Durée estimée (aller)</p>
                <p className="text-sm font-medium">{formatDuration(estimatedDuration)}</p>
              </div>
              
              {hasReturnTrip && !returnToSameAddress && customReturnCoordinates && (
                <>
                  <div className="flex justify-between">
                    <p className="text-sm">Distance estimée (retour)</p>
                    <p className="text-sm font-medium">{returnDistance} km</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Durée estimée (retour)</p>
                    <p className="text-sm font-medium">{formatDuration(returnDuration)}</p>
                  </div>
                </>
              )}
              
              <div className="flex justify-between">
                <p className="text-sm">Heure d'arrivée estimée</p>
                <p className="text-sm font-medium">
                  {time ? (
                    (() => {
                      const [hours, minutes] = time.split(':').map(Number);
                      const arrivalTime = new Date();
                      arrivalTime.setHours(hours);
                      arrivalTime.setMinutes(minutes + estimatedDuration);
                      return format(arrivalTime, 'HH:mm');
                    })()
                  ) : "Non spécifiée"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium mb-3">Détails du prix</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="text-sm">
                  <div className="flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="font-medium">Trajet aller</p>
                  </div>
                  {quoteDetails?.basePrice && (
                    <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                      {estimatedDistance} km × {quoteDetails.basePrice.toFixed(2)}€/km HT
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(quoteDetails?.oneWayPriceHT)}€ HT</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground flex items-center justify-end">
                          {formatPrice(quoteDetails?.oneWayPrice)}€ TTC
                          <InfoIcon className="h-3 w-3 ml-1" />
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">TVA 10% sur le transport</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {hasWaitingTime && (
                <div className="flex justify-between">
                  <p className="text-sm">Temps d'attente ({waitingTimeMinutes} min)</p>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(quoteDetails?.waitingTimePriceHT)}€ HT</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground flex items-center justify-end">
                            {formatPrice(quoteDetails?.waitingTimePrice)}€ TTC
                            <InfoIcon className="h-3 w-3 ml-1" />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">TVA 20% sur le temps d'attente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
              
              {hasReturnTrip && (
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <div className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p className="font-medium">Trajet retour</p>
                    </div>
                    {quoteDetails?.basePrice && (
                      <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                        {returnToSameAddress ? estimatedDistance : returnDistance} km × {quoteDetails.basePrice.toFixed(2)}€/km HT
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(quoteDetails?.returnPriceHT)}€ HT</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground flex items-center justify-end">
                            {formatPrice(quoteDetails?.returnPrice)}€ TTC
                            <InfoIcon className="h-3 w-3 ml-1" />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">TVA 10% sur le transport</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
              
              {/* Afficher les conditions tarifaires spéciales si présentes */}
              {(isNightRate || isSunday) && (
                <div className="bg-secondary/20 p-2 rounded-md mt-2 text-sm">
                  {isNightRate && (
                    <div className="flex items-center mb-1">
                      <Moon className="h-4 w-4 mr-1" />
                      <span>Tarif de nuit appliqué</span>
                    </div>
                  )}
                  {isSunday && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Majoration dimanche/jour férié</span>
                    </div>
                  )}
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <p>Prix total HT</p>
                <p className="text-lg">{formatPrice(quoteDetails?.totalPriceHT)}€</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <p>TVA</p>
                <p>{formatPrice(quoteDetails?.totalVAT)}€</p>
              </div>
              
              <div className="flex justify-between font-medium pt-2 border-t border-border/30">
                <p>Prix total TTC</p>
                <p className="text-lg">{formatPrice(quoteDetails?.totalPrice)}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto order-1 sm:order-none">
          Retour
        </Button>
        <Button onClick={handleNextStep} className="w-full sm:w-auto order-0 sm:order-none">
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default TripSummaryStep;
