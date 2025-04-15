import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download } from 'lucide-react';
import { Quote } from '@/types/quote';
import QuoteSummary from '@/components/quote/form/QuoteSummary';
import { useVehicles } from '@/hooks/useVehicles';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm';
import { useToast } from '@/hooks/use-toast';
import { generateQuotePDF } from '@/utils/quotePDF';

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
  const { toast } = useToast();

  if (!quote) return null;

  // Format the ride date
  const rideDate = new Date(quote.ride_date);
  const formattedTime = format(rideDate, 'HH:mm');
  
  // Find the selected vehicle
  const selectedVehicle = vehicles.find(v => v.id === quote.vehicle_id);
  
  // Get basePrice, prioritizing data from the selected vehicle since vehicles table doesn't have basePrice
  const basePrice = selectedVehicle?.basePrice || 0;
  
  // Prepare data for QuoteSummary
  const quoteDetails: Partial<QuoteDetailsType> = {
    oneWayPrice: quote.amount,
    totalPrice: quote.amount,
    basePrice: basePrice,
    returnPrice: quote.has_return_trip ? (quote.amount / 2) : 0,
    waitingTimePrice: quote.waiting_time_price || 0,
    estimatedDistance: quote.distance_km || 0,
    estimatedDuration: quote.duration_minutes || 0,
    amount: quote.amount,
    departureAddress: quote.departure_location,
    destinationAddress: quote.arrival_location,
    departureCoordinates: departureCoords || [0, 0],
    destinationCoordinates: destinationCoords || [0, 0],
    time: formattedTime,
    date: rideDate,
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
  
  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await generateQuotePDF(quote);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${quote.id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF généré",
        description: "Le PDF du devis a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF du devis",
        variant: "destructive",
      });
    }
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger en PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteViewDialog;
