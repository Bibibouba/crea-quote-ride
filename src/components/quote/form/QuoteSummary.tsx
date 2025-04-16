
import React from 'react';
import QuoteSummaryContainer from './summary/QuoteSummaryContainer';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm';

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
  quoteDetails?: QuoteDetailsType;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = (props) => {
  return <QuoteSummaryContainer {...props} />;
};

export default QuoteSummary;
