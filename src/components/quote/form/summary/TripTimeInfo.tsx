
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
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const [nightStartHour, nightStartMinute] = nightRateInfo.nightStart.split(':').map(Number);
    const [nightEndHour, nightEndMinute] = nightRateInfo.nightEnd.split(':').map(Number);

    // Déterminer si le voyage commence pendant les heures de nuit
    const isStartDuringNight = isWithinNightHours(
      startHour,
      startMinute,
      nightStartHour,
      nightStartMinute,
      nightEndHour,
      nightEndMinute
    );

    // Calculer l'heure d'arrivée du trajet aller
    let tripEndTime;
    if (nightRateInfo && nightRateInfo.totalHours) {
      // Calculer l'heure d'arrivée basée sur la durée totale du trajet
      const endTimeHour = startHour + Math.floor(nightRateInfo.totalHours);
      const endTimeMinute = startMinute + Math.floor((nightRateInfo.totalHours % 1) * 60);
      
      const adjustedHour = endTimeHour + Math.floor(endTimeMinute / 60);
      const adjustedMinute = endTimeMinute % 60;
      
      tripEndTime = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
    } else {
      tripEndTime = endTime;
    }

    // Déterminer si l'arrivée est pendant les heures de nuit
    const [tripEndHour, tripEndMinute] = tripEndTime.split(':').map(Number);
    const isEndDuringNight = isWithinNightHours(
      tripEndHour,
      tripEndMinute,
      nightStartHour,
      nightStartMinute,
      nightEndHour,
      nightEndMinute
    );

    // Si le départ et l'arrivée sont dans la même période (jour ou nuit)
    if (isStartDuringNight === isEndDuringNight) {
      // Ajouter un seul segment pour tout le trajet
      segments.push({
        start: startTime,
        end: tripEndTime,
        type: isStartDuringNight ? 'night-trip' : 'day-trip',
        label: "Départ"
      });
    } else {
      // Le trajet traverse une transition jour/nuit
      // Trouver le point de transition
      
      // Si on commence le jour et finit la nuit
      if (!isStartDuringNight && isEndDuringNight) {
        // Trouver l'heure de transition (début du tarif de nuit)
        const transitionTime = `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
        
        // Ajouter le segment de jour
        segments.push({
          start: startTime,
          end: transitionTime,
          type: 'day-trip',
          label: "Départ"
        });
        
        // Ajouter le segment de nuit
        segments.push({
          start: transitionTime,
          end: tripEndTime,
          type: 'night-trip'
        });
      } 
      // Si on commence la nuit et finit le jour
      else if (isStartDuringNight && !isEndDuringNight) {
        // Trouver l'heure de transition (fin du tarif de nuit)
        const transitionTime = `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`;
        
        // Ajouter le segment de nuit
        segments.push({
          start: startTime,
          end: transitionTime,
          type: 'night-trip',
          label: "Départ"
        });
        
        // Ajouter le segment de jour
        segments.push({
          start: transitionTime,
          end: tripEndTime,
          type: 'day-trip'
        });
      }
    }

    // Ajouter un segment de temps d'attente si applicable
    if (hasWaitingTime && waitingTimeMinutes > 0) {
      const waitingStart = tripEndTime;
      
      // Calculer l'heure de fin du temps d'attente
      const [waitStartHour, waitStartMinute] = waitingStart.split(':').map(Number);
      const waitTimeHours = waitingTimeMinutes / 60;
      
      const waitEndHour = waitStartHour + Math.floor(waitTimeHours);
      const waitEndMinute = waitStartMinute + Math.floor((waitTimeHours % 1) * 60);
      
      const adjustedHour = waitEndHour + Math.floor(waitEndMinute / 60);
      const adjustedMinute = waitEndMinute % 60;
      
      const waitingEnd = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
      
      // Vérifier si l'attente est en heure de jour ou de nuit
      const isWaitStartNight = isWithinNightHours(
        waitStartHour,
        waitStartMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );
      
      const [waitEndHour, waitEndMinute] = waitingEnd.split(':').map(Number);
      const isWaitEndNight = isWithinNightHours(
        waitEndHour,
        waitEndMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );
      
      // Si le début et la fin de l'attente sont dans la même période (jour ou nuit)
      if (isWaitStartNight === isWaitEndNight) {
        segments.push({
          start: waitingStart,
          end: waitingEnd,
          type: isWaitStartNight ? 'night-wait' : 'day-wait',
          label: "Attente"
        });
      } else {
        // L'attente traverse une transition jour/nuit
        
        // Si l'attente commence le jour et finit la nuit
        if (!isWaitStartNight && isWaitEndNight) {
          // Trouver l'heure de transition
          const transitionTime = `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
          
          segments.push({
            start: waitingStart,
            end: transitionTime,
            type: 'day-wait',
            label: "Attente"
          });
          
          segments.push({
            start: transitionTime,
            end: waitingEnd,
            type: 'night-wait'
          });
        } 
        // Si l'attente commence la nuit et finit le jour
        else {
          // Trouver l'heure de transition
          const transitionTime = `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`;
          
          segments.push({
            start: waitingStart,
            end: transitionTime,
            type: 'night-wait',
            label: "Attente"
          });
          
          segments.push({
            start: transitionTime,
            end: waitingEnd,
            type: 'day-wait'
          });
        }
      }
      
      // Mettre à jour l'heure de début du trajet retour
      if (hasReturnTrip) {
        const returnStartTime = waitingEnd;
        
        // Calculer l'heure de fin du retour
        let returnEndTime;
        if (returnNightRateInfo && returnNightRateInfo.totalHours) {
          const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
          const returnEndHour = returnStartHour + Math.floor(returnNightRateInfo.totalHours);
          const returnEndMinute = returnStartMinute + Math.floor((returnNightRateInfo.totalHours % 1) * 60);
          
          const adjustedHour = returnEndHour + Math.floor(returnEndMinute / 60);
          const adjustedMinute = returnEndMinute % 60;
          
          returnEndTime = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
        } else {
          // Fallback si on n'a pas d'info sur la durée du retour
          const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
          returnEndTime = `${String((returnStartHour + 1) % 24).padStart(2, '0')}:${String(returnStartMinute).padStart(2, '0')}`;
        }
        
        const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
        const isReturnStartNight = isWithinNightHours(
          returnStartHour,
          returnStartMinute,
          nightStartHour,
          nightStartMinute,
          nightEndHour,
          nightEndMinute
        );
        
        const [returnEndHour, returnEndMinute] = returnEndTime.split(':').map(Number);
        const isReturnEndNight = isWithinNightHours(
          returnEndHour,
          returnEndMinute,
          nightStartHour,
          nightStartMinute,
          nightEndHour,
          nightEndMinute
        );
        
        // Si le départ et l'arrivée du retour sont dans la même période (jour ou nuit)
        if (isReturnStartNight === isReturnEndNight) {
          segments.push({
            start: returnStartTime,
            end: returnEndTime,
            type: isReturnStartNight ? 'night-trip' : 'day-trip',
            label: "Retour"
          });
        } else {
          // Le retour traverse une transition jour/nuit
          
          // Si le retour commence le jour et finit la nuit
          if (!isReturnStartNight && isReturnEndNight) {
            // Trouver l'heure de transition
            const transitionTime = `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
            
            segments.push({
              start: returnStartTime,
              end: transitionTime,
              type: 'day-trip',
              label: "Retour"
            });
            
            segments.push({
              start: transitionTime,
              end: returnEndTime,
              type: 'night-trip'
            });
          } 
          // Si le retour commence la nuit et finit le jour
          else {
            // Trouver l'heure de transition
            const transitionTime = `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`;
            
            segments.push({
              start: returnStartTime,
              end: transitionTime,
              type: 'night-trip',
              label: "Retour"
            });
            
            segments.push({
              start: transitionTime,
              end: returnEndTime,
              type: 'day-trip'
            });
          }
        }
      }
    } else if (hasReturnTrip) {
      // Si pas de temps d'attente, le retour commence juste après l'arrivée du trajet aller
      const returnStartTime = tripEndTime;
      
      // Calculer l'heure de fin du retour
      let returnEndTime;
      if (returnNightRateInfo && returnNightRateInfo.totalHours) {
        const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
        const returnEndHour = returnStartHour + Math.floor(returnNightRateInfo.totalHours);
        const returnEndMinute = returnStartMinute + Math.floor((returnNightRateInfo.totalHours % 1) * 60);
        
        const adjustedHour = returnEndHour + Math.floor(returnEndMinute / 60);
        const adjustedMinute = returnEndMinute % 60;
        
        returnEndTime = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
      } else {
        // Fallback si on n'a pas d'info sur la durée du retour
        const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
        returnEndTime = `${String((returnStartHour + 1) % 24).padStart(2, '0')}:${String(returnStartMinute).padStart(2, '0')}`;
      }
      
      const [returnStartHour, returnStartMinute] = returnStartTime.split(':').map(Number);
      const isReturnStartNight = isWithinNightHours(
        returnStartHour,
        returnStartMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );
      
      const [returnEndHour, returnEndMinute] = returnEndTime.split(':').map(Number);
      const isReturnEndNight = isWithinNightHours(
        returnEndHour,
        returnEndMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );
      
      // Si le départ et l'arrivée du retour sont dans la même période (jour ou nuit)
      if (isReturnStartNight === isReturnEndNight) {
        segments.push({
          start: returnStartTime,
          end: returnEndTime,
          type: isReturnStartNight ? 'night-trip' : 'day-trip',
          label: "Retour"
        });
      } else {
        // Le retour traverse une transition jour/nuit
        
        // Si le retour commence le jour et finit la nuit
        if (!isReturnStartNight && isReturnEndNight) {
          // Trouver l'heure de transition
          const transitionTime = `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
          
          segments.push({
            start: returnStartTime,
            end: transitionTime,
            type: 'day-trip',
            label: "Retour"
          });
          
          segments.push({
            start: transitionTime,
            end: returnEndTime,
            type: 'night-trip'
          });
        } 
        // Si le retour commence la nuit et finit le jour
        else {
          // Trouver l'heure de transition
          const transitionTime = `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`;
          
          segments.push({
            start: returnStartTime,
            end: transitionTime,
            type: 'night-trip',
            label: "Retour"
          });
          
          segments.push({
            start: transitionTime,
            end: returnEndTime,
            type: 'day-trip'
          });
        }
      }
    }

    return segments;
  };

  // Calculer l'heure de fin totale (incluant le trajet retour si applicable)
  const calculateFinalEndTime = () => {
    if (!hasReturnTrip) {
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
