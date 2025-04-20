
import React from 'react';
import { Clock } from 'lucide-react';

interface TripTimingHeaderProps {
  startTime: string;
  finalTimeDisplay: string;
}

export const TripTimingHeader: React.FC<TripTimingHeaderProps> = ({
  startTime,
  finalTimeDisplay
}) => {
  return (
    <div className="flex justify-between text-sm mb-2">
      <p className="flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        Départ: <span className="font-medium ml-1">{startTime}</span>
      </p>
      <p className="flex items-center">
        Arrivée: <span className="font-medium ml-1">{finalTimeDisplay}</span>
      </p>
    </div>
  );
};
