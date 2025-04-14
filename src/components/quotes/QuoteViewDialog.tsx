
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Quote } from '@/types/quote';
import QuoteSummary from '@/components/quote/form/QuoteSummary';
import { useVehicles } from '@/hooks/useVehicles';
import { Vehicle } from '@/types/quoteForm';

interface QuoteViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
}

const QuoteViewDialog: React.FC<QuoteViewDialogProps> = ({
  isOpen,
  onClose,
  quote
}) => {
  const { vehicles } = useVehicles();

  if (!quote) return null;

  // Format the ride date
  const rideDate = new Date(quote.ride_date);
  const formattedTime = format(rideDate, 'HH:mm');
  
  // Find the selected vehicle
  const selectedVehicle = vehicles.find(v => v.id === quote.vehicle_id);
  
  // Get basePrice, prioritizing data from the selected vehicle since vehicles table doesn't have basePrice
  const basePrice = selectedVehicle?.basePrice || 0;
  
  // Prepare data for QuoteSummary
  const quoteDetails = {
    oneWayPrice: quote.amount,
    totalPrice: quote.amount,
    basePrice: basePrice,
    returnPrice: quote.has_return_trip ? (quote.amount / 2) : 0,
    waitingTimePrice: quote.waiting_time_price || 0
  };

  // Ensure coordinates are properly formatted as [number, number]
  const departureCoords = quote.departure_coordinates ? 
    (Array.isArray(quote.departure_coordinates) && quote.departure_coordinates.length >= 2 ? 
      [quote.departure_coordinates[0], quote.departure_coordinates[1]] as [number, number] : 
      undefined) : 
    undefined;
  
  const destinationCoords = quote.arrival_coordinates ? 
    (Array.isArray(quote.arrival_coordinates) && quote.arrival_coordinates.length >= 2 ? 
      [quote.arrival_coordinates[0], quote.arrival_coordinates[1]] as [number, number] : 
      undefined) : 
    undefined;
  
  const returnCoords = quote.return_coordinates ? 
    (Array.isArray(quote.return_coordinates) && quote.return_coordinates.length >= 2 ? 
      [quote.return_coordinates[0], quote.return_coordinates[1]] as [number, number] : 
      undefined) : 
    undefined;

  const vehicleName = quote.vehicles?.name || selectedVehicle?.name || 'Véhicule inconnu';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du devis #{quote.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <QuoteSummary
            departureAddress={quote.departure_location}
            destinationAddress={quote.arrival_location}
            departureCoordinates={departureCoords}
            destinationCoordinates={destinationCoords}
            date={rideDate}
            time={formattedTime}
            estimatedDistance={quote.distance_km || 0}
            estimatedDuration={quote.duration_minutes || 0}
            selectedVehicle={quote.vehicle_id || ''}
            passengers="4" // Default value as it might not be stored
            basePrice={basePrice}
            estimatedPrice={quote.amount}
            isSubmitting={false}
            onSaveQuote={() => {}}
            onEditQuote={() => {}}
            showClientInfo={false}
            vehicles={vehicles as Vehicle[]}
            hasReturnTrip={quote.has_return_trip || false}
            hasWaitingTime={quote.has_waiting_time || false}
            waitingTimeMinutes={quote.waiting_time_minutes || 0}
            waitingTimePrice={quote.waiting_time_price || 0}
            returnToSameAddress={quote.return_to_same_address || true}
            customReturnAddress={quote.custom_return_address || ''}
            returnDistance={quote.return_distance_km || 0}
            returnDuration={quote.return_duration_minutes || 0}
            returnCoordinates={returnCoords}
            quoteDetails={quoteDetails}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteViewDialog;
