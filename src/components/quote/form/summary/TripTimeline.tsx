
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSegment {
  start: string;
  end: string;
  type: 'day-trip' | 'day-wait' | 'night-wait' | 'night-trip';
  label?: string;
}

interface TripTimelineProps {
  segments: TimeSegment[];
  startTime: string;
  endTime: string;
  departureLabel?: string;
  arrivalLabel?: string;
  returnDepartureLabel?: string;
  returnArrivalLabel?: string;
  hasReturnTrip?: boolean;
}

const getSegmentColor = (type: TimeSegment['type']) => {
  switch (type) {
    case 'day-trip':
      return 'bg-blue-100'; // #dbeafe
    case 'day-wait':
      return 'bg-green-50'; // #dcfce7
    case 'night-wait':
      return 'bg-green-200'; // #bbf7d0
    case 'night-trip':
      return 'bg-red-100'; // #fee2e2
    default:
      return 'bg-gray-100';
  }
};

const TripTimeline: React.FC<TripTimelineProps> = ({
  segments,
  startTime,
  endTime,
  departureLabel = "Départ",
  arrivalLabel = "Arrivée",
  returnDepartureLabel = "Départ retour",
  returnArrivalLabel = "Arrivée",
  hasReturnTrip = false,
}) => {
  // Calculate total duration in minutes
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const totalMinutes = endMinutes < startMinutes 
    ? (24 * 60) - startMinutes + endMinutes 
    : endMinutes - startMinutes;

  return (
    <div className="space-y-6">
      <div className="text-sm flex justify-between mb-1">
        <div className="font-medium">Chronologie du Trajet</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Tarif jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 rounded"></div>
            <span>Attente jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Attente nuit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Tarif nuit</span>
          </div>
        </div>
      </div>

      <div className="relative h-16">
        {/* Timeline bar */}
        <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full">
          {segments.map((segment, index) => {
            const segmentStart = ((timeToMinutes(segment.start) - startMinutes + (startMinutes > timeToMinutes(segment.start) ? 24 * 60 : 0)) / totalMinutes) * 100;
            const segmentEnd = ((timeToMinutes(segment.end) - startMinutes + (startMinutes > timeToMinutes(segment.end) ? 24 * 60 : 0)) / totalMinutes) * 100;
            const width = segmentEnd - segmentStart;

            return (
              <div
                key={index}
                className={`absolute h-full ${getSegmentColor(segment.type)} rounded-full`}
                style={{
                  left: `${segmentStart}%`,
                  width: `${width}%`
                }}
              />
            );
          })}
        </div>

        {/* Time markers */}
        {segments.map((segment, index) => {
          const position = ((timeToMinutes(segment.start) - startMinutes + (startMinutes > timeToMinutes(segment.start) ? 24 * 60 : 0)) / totalMinutes) * 100;
          return (
            <React.Fragment key={`marker-${index}`}>
              <div
                className="absolute w-1 h-1 bg-gray-600 rounded-full transform -translate-x-1/2"
                style={{
                  left: `${position}%`,
                  top: "calc(1.5rem - 2px)"
                }}
              />
              <div
                className="absolute text-xs transform -translate-x-1/2 whitespace-nowrap"
                style={{
                  left: `${position}%`,
                  top: "0"
                }}
              >
                {segment.start}
              </div>
              {segment.label && (
                <div
                  className="absolute text-xs transform -translate-x-1/2 whitespace-nowrap text-muted-foreground"
                  style={{
                    left: `${position}%`,
                    bottom: "0"
                  }}
                >
                  {segment.label}
                </div>
              )}
            </React.Fragment>
          );
        })}
        
        {/* End time marker */}
        <div
          className="absolute w-1 h-1 bg-gray-600 rounded-full transform -translate-x-1/2"
          style={{
            left: "100%",
            top: "calc(1.5rem - 2px)"
          }}
        />
        <div
          className="absolute text-xs transform -translate-x-1/2 whitespace-nowrap"
          style={{
            left: "100%",
            top: "0"
          }}
        >
          {endTime}
        </div>
        {hasReturnTrip && (
          <div
            className="absolute text-xs transform -translate-x-1/2 whitespace-nowrap text-muted-foreground"
            style={{
              left: "100%",
              bottom: "0"
            }}
          >
            {returnArrivalLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripTimeline;
