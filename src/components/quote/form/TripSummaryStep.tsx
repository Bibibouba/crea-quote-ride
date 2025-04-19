
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle, QuoteDetailsType } from '@/types/quoteForm';

interface TripSummaryStepProps {
  departureAddress: string;
  destinationAddress: string;
  customReturnAddress: string;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  date: Date;
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
  quoteDetails?: QuoteDetailsType;
  vehicles: Vehicle[];
  handleRouteCalculated: (distance: number, duration: number) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

const TripSummaryStep: React.FC<TripSummaryStepProps> = ({
  handleNextStep,
  handlePreviousStep
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="border rounded-md p-6 bg-secondary/10">
            <p className="text-center text-muted-foreground">
              Cette section sera développée pas à pas.
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              className="w-full sm:w-auto"
            >
              Retour
            </Button>
            <Button
              onClick={handleNextStep}
              className="w-full sm:w-auto"
            >
              Étape suivante
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripSummaryStep;
