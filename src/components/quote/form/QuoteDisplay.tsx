
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import QuoteSummary from './QuoteSummary';
import ClientInfoSection from './ClientInfoSection';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm'; // Updated import
import { calculateQuoteDetails } from '@/utils/pricing';
import { usePricing } from '@/hooks/use-pricing';

interface QuoteDisplayProps {
  departureAddress: string;
  destinationAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date: Date;
  time: string;
  estimatedDistance: number;
  estimatedDuration: number;
  selectedVehicle: string;
  passengers: string;
  basePrice: number;
  estimatedPrice: number;
  isSubmitting: boolean;
  onSaveQuote: () => Promise<void>;
  onEditQuote: () => void;
  clientId?: string;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  vehicles: Vehicle[];
  hasReturnTrip: boolean;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  returnDistance: number;
  returnDuration: number;
  returnCoordinates?: [number, number];
  quoteDetails?: any;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
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
  clientId,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  vehicles,
  hasReturnTrip,
  hasWaitingTime,
  waitingTimeMinutes,
  waitingTimePrice,
  returnToSameAddress,
  customReturnAddress,
  returnDistance,
  returnDuration,
  returnCoordinates,
  quoteDetails
}) => {
  const { pricingSettings } = usePricing();
  
  // Get the selected vehicle details
  const selectedVehicleDetails = vehicles.find(v => v.id === selectedVehicle);
  
  // Calculate quote details if not provided
  const displayDetails = quoteDetails || calculateQuoteDetails(
    selectedVehicle,
    estimatedDistance,
    returnToSameAddress ? estimatedDistance : returnDistance,
    hasReturnTrip,
    returnToSameAddress,
    vehicles,
    hasWaitingTime,
    waitingTimePrice,
    time,
    date,
    pricingSettings
  );
  
  // Use precise pricing from quoteDetails if available
  const displayEstimatedPrice = displayDetails?.totalPrice || estimatedPrice;
  
  // Log the quote details to verify calculations
  console.log('QuoteDisplay - Quote details:', {
    dayKm: displayDetails?.dayKm,
    nightKm: displayDetails?.nightKm,
    dayPrice: displayDetails?.dayPrice,
    nightPrice: displayDetails?.nightPrice,
    nightRateApplied: displayDetails?.isNightRate,
    nightHours: displayDetails?.nightHours,
    dayHours: displayDetails?.dayHours,
    nightRatePercentage: displayDetails?.nightRatePercentage,
    totalHT: displayDetails?.totalPriceHT,
    vat: displayDetails?.totalVAT,
    totalTTC: displayDetails?.totalPrice
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre devis VTC</CardTitle>
        <CardDescription>
          Estimation pour votre trajet du {date ? format(date, "d MMMM yyyy", { locale: fr }) : ""} à {time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QuoteSummary 
          departureAddress={departureAddress}
          destinationAddress={destinationAddress}
          departureCoordinates={departureCoordinates}
          destinationCoordinates={destinationCoordinates}
          date={date}
          time={time}
          estimatedDistance={estimatedDistance}
          estimatedDuration={estimatedDuration}
          selectedVehicle={selectedVehicle}
          passengers={passengers}
          basePrice={selectedVehicleDetails?.basePrice || basePrice}
          estimatedPrice={displayEstimatedPrice}
          isSubmitting={isSubmitting}
          onSaveQuote={onSaveQuote}
          onEditQuote={onEditQuote}
          showClientInfo={!clientId}
          clientInfoComponent={
            !clientId ? (
              <ClientInfoSection 
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
              />
            ) : undefined
          }
          vehicles={vehicles}
          hasReturnTrip={hasReturnTrip}
          hasWaitingTime={hasWaitingTime}
          waitingTimeMinutes={waitingTimeMinutes}
          waitingTimePrice={waitingTimePrice}
          returnToSameAddress={returnToSameAddress}
          customReturnAddress={customReturnAddress}
          returnDistance={returnDistance}
          returnDuration={returnDuration}
          returnCoordinates={returnCoordinates}
          quoteDetails={displayDetails}
        />
      </CardContent>
    </Card>
  );
};

export default QuoteDisplay;
