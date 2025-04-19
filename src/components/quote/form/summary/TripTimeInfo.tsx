
import React from 'react';
import { Moon, Calendar } from 'lucide-react';
import TripTimeline from './TripTimeline';
import { isWithinNightHours } from '@/utils/time/nightTimeChecker';
import { VehicleRateInfo } from './VehicleRateInfo';

export interface NightRateInfo {
  isApplied: boolean;
  percentage: number;
  nightHours: number;
  totalHours: number;
  nightStart: string;
  nightEnd: string;
  nightSurcharge?: number;
  dayKm?: number;
  nightKm?: number;
  totalKm?: number;
  dayPrice?: number;
  nightPrice?: number;
  dayPercentage?: number;
  nightPercentage?: number;
}

export interface SundayRateInfo {
  isApplied: boolean;
  percentage: number;
}

interface TripTimeInfoProps {
  startTime: string;
  endTime: string;
  nightRateInfo?: NightRateInfo;
  returnNightRateInfo?: NightRateInfo;
  sundayRateInfo?: SundayRateInfo;
  hasReturnTrip?: boolean;
  selectedVehicleName?: string;
  hasWaitingTime?: boolean;
  waitingTimeMinutes?: number;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip,
  selectedVehicleName = "A",
  hasWaitingTime = false,
  waitingTimeMinutes = 0
}) => {
  // Cette fonction détermine les segments du trajet (jour/nuit)
  const getTimeSegments = () => {
    if (!nightRateInfo) return [];
    
    const segments = [];
    
    // Convertir les heures pour une comparaison plus facile
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [nightStartHour, nightStartMinute] = nightRateInfo.nightStart.split(':').map(Number);
    const [nightEndHour, nightEndMinute] = nightRateInfo.nightEnd.split(':').map(Number);

    // Fonction utilitaire pour calculer l'heure de fin en fonction de la durée
    const calculateEndTime = (startHour, startMinute, durationHours) => {
      const totalMinutes = startHour * 60 + startMinute + durationHours * 60;
      const newHour = Math.floor(totalMinutes / 60) % 24;
      const newMinute = Math.floor(totalMinutes % 60);
      return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    };

    // Calculer l'heure d'arrivée du trajet aller
    const tripEndTime = nightRateInfo.totalHours 
      ? calculateEndTime(startHour, startMinute, nightRateInfo.totalHours) 
      : endTime;

    // Déterminer si le voyage commence pendant les heures de nuit
    const isStartDuringNight = isWithinNightHours(
      startHour, startMinute, 
      nightStartHour, nightStartMinute, 
      nightEndHour, nightEndMinute
    );

    // Déterminer si l'arrivée est pendant les heures de nuit
    const [tripEndHour, tripEndMinute] = tripEndTime.split(':').map(Number);
    const isEndDuringNight = isWithinNightHours(
      tripEndHour, tripEndMinute,
      nightStartHour, nightStartMinute,
      nightEndHour, nightEndMinute
    );

    // Traitement pour le trajet aller
    if (isStartDuringNight === isEndDuringNight) {
      // Si tout le trajet est en tarif jour ou tout en tarif nuit
      segments.push({
        start: startTime,
        end: tripEndTime,
        type: isStartDuringNight ? 'night-trip' : 'day-trip',
        label: "Départ"
      });
    } else {
      // Le trajet traverse une transition jour/nuit
      const transitionTime = isStartDuringNight 
        ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
        : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
      
      segments.push({
        start: startTime,
        end: transitionTime,
        type: isStartDuringNight ? 'night-trip' : 'day-trip',
        label: "Départ"
      });
      
      segments.push({
        start: transitionTime,
        end: tripEndTime,
        type: isStartDuringNight ? 'day-trip' : 'night-trip'
      });
    }

    // Traitement du temps d'attente si applicable
    if (hasWaitingTime && waitingTimeMinutes > 0) {
      const waitingStartTime = tripEndTime;
      const waitingTimeHours = waitingTimeMinutes / 60;
      
      // Calculer l'heure de fin de l'attente
      const waitingEndTime = calculateEndTime(
        parseInt(waitingStartTime.split(':')[0]), 
        parseInt(waitingStartTime.split(':')[1]), 
        waitingTimeHours
      );

      const [waitStartHour, waitStartMinute] = waitingStartTime.split(':').map(Number);
      const [waitEndHour, waitEndMinute] = waitingEndTime.split(':').map(Number);
      
      const isWaitStartNight = isWithinNightHours(
        waitStartHour, waitStartMinute,
        nightStartHour, nightStartMinute,
        nightEndHour, nightEndMinute
      );
      
      const isWaitEndNight = isWithinNightHours(
        waitEndHour, waitEndMinute,
        nightStartHour, nightStartMinute,
        nightEndHour, nightEndMinute
      );

      // Si toute l'attente est en jour ou toute en nuit
      if (isWaitStartNight === isWaitEndNight) {
        segments.push({
          start: waitingStartTime,
          end: waitingEndTime,
          type: isWaitStartNight ? 'night-wait' : 'day-wait',
          label: "Attente"
        });
      } else {
        // L'attente traverse une transition jour/nuit
        const transitionTime = isWaitStartNight 
          ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
          : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
        
        segments.push({
          start: waitingStartTime,
          end: transitionTime,
          type: isWaitStartNight ? 'night-wait' : 'day-wait',
          label: "Attente"
        });
        
        segments.push({
          start: transitionTime,
          end: waitingEndTime,
          type: isWaitStartNight ? 'day-wait' : 'night-wait'
        });
      }

      // Mettre à jour le point de départ du trajet retour
      if (hasReturnTrip) {
        const returnStartTime = waitingEndTime;
        const returnDuration = returnNightRateInfo?.totalHours || 1; // Fallback d'une heure si pas d'info
        
        // Calculer l'heure de fin du retour
        const returnEndTime = calculateEndTime(
          parseInt(returnStartTime.split(':')[0]), 
          parseInt(returnStartTime.split(':')[1]), 
          returnDuration
        );

        const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
        const [returnEndHour, returnEndMinute] = returnEndTime.split(':').map(Number);
        
        const isReturnStartNight = isWithinNightHours(
          returnStartHour, returnStartMinute,
          nightStartHour, nightStartMinute,
          nightEndHour, nightEndMinute
        );
        
        const isReturnEndNight = isWithinNightHours(
          returnEndHour, returnEndMinute,
          nightStartHour, nightStartMinute,
          nightEndHour, nightEndMinute
        );

        // Si tout le retour est en jour ou tout en nuit
        if (isReturnStartNight === isReturnEndNight) {
          segments.push({
            start: returnStartTime,
            end: returnEndTime,
            type: isReturnStartNight ? 'night-trip' : 'day-trip',
            label: "Retour"
          });
        } else {
          // Le retour traverse une transition jour/nuit
          const transitionTime = isReturnStartNight 
            ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
            : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
          
          segments.push({
            start: returnStartTime,
            end: transitionTime,
            type: isReturnStartNight ? 'night-trip' : 'day-trip',
            label: "Retour"
          });
          
          segments.push({
            start: transitionTime,
            end: returnEndTime,
            type: isReturnStartNight ? 'day-trip' : 'night-trip'
          });
        }
      }
    } 
    // Trajet retour sans temps d'attente
    else if (hasReturnTrip) {
      const returnStartTime = tripEndTime;
      const returnDuration = returnNightRateInfo?.totalHours || 1; // Fallback d'une heure si pas d'info
      
      // Calculer l'heure de fin du retour
      const returnEndTime = calculateEndTime(
        parseInt(returnStartTime.split(':')[0]), 
        parseInt(returnStartTime.split(':')[1]), 
        returnDuration
      );

      const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
      const [returnEndHour, returnEndMinute] = returnEndTime.split(':').map(Number);
      
      const isReturnStartNight = isWithinNightHours(
        returnStartHour, returnStartMinute,
        nightStartHour, nightStartMinute,
        nightEndHour, nightEndMinute
      );
      
      const isReturnEndNight = isWithinNightHours(
        returnEndHour, returnEndMinute,
        nightStartHour, nightStartMinute,
        nightEndHour, nightEndMinute
      );

      // Si tout le retour est en jour ou tout en nuit
      if (isReturnStartNight === isReturnEndNight) {
        segments.push({
          start: returnStartTime,
          end: returnEndTime,
          type: isReturnStartNight ? 'night-trip' : 'day-trip',
          label: "Retour"
        });
      } else {
        // Le retour traverse une transition jour/nuit
        const transitionTime = isReturnStartNight 
          ? `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`
          : `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
        
        segments.push({
          start: returnStartTime,
          end: transitionTime,
          type: isReturnStartNight ? 'night-trip' : 'day-trip',
          label: "Retour"
        });
        
        segments.push({
          start: transitionTime,
          end: returnEndTime,
          type: isReturnStartNight ? 'day-trip' : 'night-trip'
        });
      }
    }

    return segments;
  };

  // Calculer l'heure de fin totale (incluant le trajet retour si applicable)
  const calculateFinalEndTime = () => {
    if (!hasReturnTrip && !hasWaitingTime) {
      return endTime;
    }
    
    const segments = getTimeSegments();
    if (segments.length > 0) {
      return segments[segments.length - 1].end;
    }
    
    return endTime;
  };

  return (
    <div className="space-y-4">
      {nightRateInfo && (
        <VehicleRateInfo 
          vehicleName={selectedVehicleName}
          nightStart={nightRateInfo.nightStart}
          nightEnd={nightRateInfo.nightEnd}
        />
      )}
      
      <div className="bg-secondary/20 p-3 rounded-md mt-2 text-sm space-y-3">
        <h3 className="font-medium mb-2">Chronologie du Trajet</h3>
        
        {/* Légende des couleurs en haut, en dehors de la jauge */}
        <div className="flex flex-wrap justify-start gap-3 p-2 mb-2 bg-white/60 rounded border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span className="text-xs">Tarif jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 rounded"></div>
            <span className="text-xs">Attente jour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-xs">Attente nuit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span className="text-xs">Tarif nuit</span>
          </div>
        </div>
        
        <TripTimeline
          segments={getTimeSegments()}
          startTime={startTime}
          endTime={calculateFinalEndTime()}
          hasReturnTrip={hasReturnTrip}
        />
        
        {sundayRateInfo && sundayRateInfo.isApplied && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              Majoration dimanche/jour férié appliquée ({sundayRateInfo.percentage}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
