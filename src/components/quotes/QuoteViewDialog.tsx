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
  
  // Prepare coordinates variables
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
  
  // Prepare data for QuoteSummary - using types that actually exist in QuoteDetailsType
  const quoteDetails: Partial<QuoteDetailsType> = {
    basePrice: basePrice,
    isNightRate: quote.has_night_rate || false,
    isSunday: quote.is_sunday_holiday || false,
    oneWayPriceHT: quote.one_way_price_ht || 0,
    oneWayPrice: quote.one_way_price || 0,
    returnPriceHT: quote.return_price_ht || 0,
    returnPrice: quote.return_price || 0,
    waitingTimePriceHT: quote.waiting_time_price || 0,
    waitingTimePrice: quote.waiting_time_price ? quote.waiting_time_price * 1.2 : 0, // Approximation with 20% VAT
    totalPriceHT: quote.amount_ht || 0,
    totalVAT: quote.amount_ht ? quote.amount - quote.amount_ht : 0,
    totalPrice: quote.amount,
    nightSurcharge: quote.night_surcharge || 0,
    sundaySurcharge: quote.sunday_holiday_surcharge || 0,
    rideVatRate: 10, // Default VAT rate for rides in France
    waitingVatRate: 20, // Default VAT rate for waiting time in France
    hasMinDistanceWarning: false,
    minDistance: 0,
    nightMinutes: quote.night_hours ? quote.night_hours * 60 : 0,
    totalMinutes: (quote.night_hours || 0 + quote.day_hours || 0) * 60,
    nightRatePercentage: quote.night_rate_percentage || 0,
    nightHours: quote.night_hours || 0,
    dayHours: quote.day_hours || 0,
    nightStartDisplay: '',
    nightEndDisplay: '',
    dayKm: quote.day_km || 0,
    nightKm: quote.night_km || 0,
    totalKm: quote.total_km || quote.distance_km || 0,
    dayPrice: quote.day_price || 0,
    nightPrice: quote.night_price || 0,
    sundayRate: quote.sunday_holiday_percentage || 0,
    waitTimeDay: quote.wait_time_day || 0,
    waitTimeNight: quote.wait_time_night || 0,
    waitPriceDay: quote.wait_price_day || 0,
    waitPriceNight: quote.wait_price_night || 0
  };
  
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Détail du Devis</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-auto">
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
            estimatedPrice={quote.amount} // Use the real amount
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
          <Button onClick={handleDownloadPDF} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Télécharger le devis (PDF)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteViewDialog;
