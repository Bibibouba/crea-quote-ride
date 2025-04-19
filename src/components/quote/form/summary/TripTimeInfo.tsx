
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
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  returnNightRateInfo,
  sundayRateInfo,
  hasReturnTrip,
  selectedVehicleName = "A"
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

    // Déterminer si l'arrivée est pendant les heures de nuit
    const isEndDuringNight = isWithinNightHours(
      endHour,
      endMinute,
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
        end: endTime,
        type: isStartDuringNight ? 'night-trip' : 'day-trip',
        label: "Départ"
      });
    } else {
      // Le trajet traverse une transition jour/nuit
      // Nous devons trouver le point de transition
      
      // Normaliser les heures pour gérer les transitions au-delà de minuit
      const normalizedStartHour = startHour >= nightStartHour ? startHour : startHour + 24;
      const normalizedEndHour = endHour >= nightStartHour ? endHour : endHour + 24;
      
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
          end: endTime,
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
          end: endTime,
          type: 'day-trip'
        });
      }
    }

    // Gérer le trajet de retour si nécessaire
    if (hasReturnTrip) {
      // Pour simplifier, nous utilisons la même heure d'arrivée comme heure de départ du retour
      // En réalité, il pourrait y avoir un temps d'attente entre les deux
      
      // Déterminer si le retour commence pendant les heures de nuit
      const isReturnStartDuringNight = isWithinNightHours(
        endHour,
        endMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );

      // Calculer l'heure de fin du retour
      let returnEndTime;
      if (returnNightRateInfo) {
        // Si nous avons des infos sur le tarif de nuit pour le retour, utiliser pour calculer l'heure d'arrivée
        const returnEndHour = Math.floor(endHour + returnNightRateInfo.totalHours);
        const returnEndMinute = Math.floor(endMinute + (returnNightRateInfo.totalHours % 1) * 60);
        
        // Gérer les dépassements
        const adjustedHour = returnEndHour + Math.floor(returnEndMinute / 60);
        const adjustedMinute = returnEndMinute % 60;
        
        returnEndTime = `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
      } else {
        // Par défaut (estimation: arrivée 51 minutes après le départ du retour)
        returnEndTime = "21:51";
      }

      // Déterminer si le retour se termine pendant les heures de nuit
      const finalHour = parseInt(returnEndTime.split(':')[0]);
      const finalMinute = parseInt(returnEndTime.split(':')[1]);
      
      const isReturnEndDuringNight = isWithinNightHours(
        finalHour,
        finalMinute,
        nightStartHour,
        nightStartMinute,
        nightEndHour,
        nightEndMinute
      );

      // Si le retour commence et finit dans la même période (jour ou nuit)
      if (isReturnStartDuringNight === isReturnEndDuringNight) {
        segments.push({
          start: endTime,
          end: returnEndTime,
          type: isReturnStartDuringNight ? 'night-trip' : 'day-trip',
          label: "Retour"
        });
      } else {
        // Le retour traverse une transition jour/nuit
        // Trouver le point de transition
        
        // Si le retour commence le jour et finit la nuit
        if (!isReturnStartDuringNight && isReturnEndDuringNight) {
          // Trouver l'heure de transition (début du tarif de nuit)
          const transitionTime = `${String(nightStartHour).padStart(2, '0')}:${String(nightStartMinute).padStart(2, '0')}`;
          
          // Ajouter le segment de jour
          segments.push({
            start: endTime,
            end: transitionTime,
            type: 'day-trip',
            label: "Retour"
          });
          
          // Ajouter le segment de nuit
          segments.push({
            start: transitionTime,
            end: returnEndTime,
            type: 'night-trip'
          });
        } 
        // Si le retour commence la nuit et finit le jour
        else if (isReturnStartDuringNight && !isReturnEndDuringNight) {
          // Trouver l'heure de transition (fin du tarif de nuit)
          const transitionTime = `${String(nightEndHour).padStart(2, '0')}:${String(nightEndMinute).padStart(2, '0')}`;
          
          // Ajouter le segment de nuit
          segments.push({
            start: endTime,
            end: transitionTime,
            type: 'night-trip',
            label: "Retour"
          });
          
          // Ajouter le segment de jour
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
        
        {/* Légende des couleurs en haut */}
        <div className="flex flex-wrap justify-end gap-3 p-2 mb-2 bg-white/60 rounded border border-gray-100">
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
          endTime={hasReturnTrip && returnNightRateInfo ? 
            // Calculer l'heure d'arrivée finale pour le retour
            (() => {
              const [endHour, endMinute] = endTime.split(':').map(Number);
              const returnEndHour = Math.floor(endHour + returnNightRateInfo.totalHours);
              const returnEndMinute = Math.floor(endMinute + (returnNightRateInfo.totalHours % 1) * 60);
              
              // Gérer les dépassements
              const adjustedHour = returnEndHour + Math.floor(returnEndMinute / 60);
              const adjustedMinute = returnEndMinute % 60;
              
              return `${String(adjustedHour % 24).padStart(2, '0')}:${String(adjustedMinute).padStart(2, '0')}`;
            })() : 
            endTime}
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
