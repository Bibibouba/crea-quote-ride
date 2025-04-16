
import React from 'react';
import { TripDetailsCard } from './TripDetailsCard';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm';

interface TripDetailsSectionProps {
  selectedVehicle: string;
  passengers: string;
  basePrice: number;
  estimatedPrice: number;
  vehicles: Vehicle[];
  time: string;
  hasWaitingTime: boolean;
  waitingTimeMinutes: number;
  waitingTimePrice: number;
  hasReturnTrip: boolean;
  returnToSameAddress: boolean;
  customReturnAddress: string;
  returnDistance: number;
  returnDuration: number;
  returnPrice: number;
  totalPrice: number;
  tripEndTime: Date;
  isNightRateApplied: boolean;
  nightHours: number;
  dayHours: number;
  isSunday: boolean;
  nightRatePercentage: number;
  nightRateStart: string;
  nightRateEnd: string;
  sundayRate: number;
  quoteDetails?: QuoteDetailsType;
}

export const TripDetailsSection: React.FC<TripDetailsSectionProps> = (props) => {
  return (
    <div className="space-y-4">
      <TripDetailsCard {...props} />
    </div>
  );
};
