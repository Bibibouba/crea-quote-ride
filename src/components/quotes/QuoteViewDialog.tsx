
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
  
  // Prepare data for QuoteSummary
  const quoteDetails = {
    oneWayPrice: quote.amount,
    totalPrice: quote.amount,
    basePrice: selectedVehicle?.basePrice || 0,
    returnPrice: quote.has_return_trip ? (quote.amount / 2) : 0,
    waitingTimePrice: quote.waiting_time_price || 0
  };

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
            departureCoordinates={quote.departure_coordinates as [number, number] || undefined}
            destinationCoordinates={quote.arrival_coordinates as [number, number] || undefined}
            date={rideDate}
            time={formattedTime}
            estimatedDistance={quote.distance_km || 0}
            estimatedDuration={quote.duration_minutes || 0}
            selectedVehicle={quote.vehicle_id || ''}
            passengers="4" // Default value as it might not be stored
            basePrice={selectedVehicle?.basePrice || 0}
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
            returnCoordinates={quote.return_coordinates as [number, number] || undefined}
            quoteDetails={quoteDetails}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteViewDialog;
