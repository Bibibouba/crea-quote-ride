
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
      return 'bg-blue-100'; // Bleu clair pour tarif jour
    case 'day-wait':
      return 'bg-green-50'; // Vert clair pour attente jour
    case 'night-wait':
      return 'bg-green-200'; // Vert foncé pour attente nuit
    case 'night-trip':
      return 'bg-red-100'; // Rouge clair pour tarif nuit
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
  // Calculer la durée totale en minutes pour l'échelle de la timeline
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = timeToMinutes(startTime);
  
  // Gérer l'heure de fin qui pourrait être le jour suivant (après minuit)
  const endMinutes = timeToMinutes(endTime);
  const totalMinutes = endMinutes < startMinutes 
    ? (24 * 60) - startMinutes + endMinutes 
    : endMinutes - startMinutes;

  return (
    <div className="space-y-4">
      <div className="relative h-16">
        {/* Barre de timeline */}
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

        {/* Marqueurs de temps */}
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
        
        {/* Marqueur du temps de fin */}
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
