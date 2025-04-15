
import { Separator } from '@/components/ui/separator';
import { Clock, Moon, Calendar, AlertCircle, Info, ArrowDownRight, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
}

export interface SundayRateInfo {
  isApplied: boolean;
  percentage: number;
}

interface TripTimeInfoProps {
  startTime: string;
  endTime: string;
  nightRateInfo?: NightRateInfo;
  sundayRateInfo?: SundayRateInfo;
}

export const TripTimeInfo: React.FC<TripTimeInfoProps> = ({
  startTime,
  endTime,
  nightRateInfo,
  sundayRateInfo
}) => {
  if (!nightRateInfo?.isApplied && !sundayRateInfo?.isApplied) {
    return null;
  }

  // Format night hours for display
  const formatNightHours = (hours: number) => {
    const fullHours = Math.floor(hours);
    const minutes = Math.round((hours - fullHours) * 60);
    
    if (minutes === 0) {
      return `${fullHours}h`;
    } else if (fullHours === 0) {
      return `${minutes} min`;
    } else {
      return `${fullHours}h${minutes.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="space-y-3">
      {nightRateInfo?.isApplied && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-200 shadow-sm">
          <Moon className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800 text-base font-bold">
            Majoration tarif de nuit : +{nightRateInfo.percentage}%
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                <p>
                  <span className="font-bold">{formatNightHours(nightRateInfo.nightHours)}</span> de 
                  votre trajet (sur un total de {Math.round(nightRateInfo.totalHours * 10) / 10}h) 
                  se déroule en période de nuit.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                <p>
                  <span className="font-semibold">Période de nuit :</span> De {nightRateInfo.nightStart} à {nightRateInfo.nightEnd}
                </p>
              </div>
              
              {nightRateInfo.nightSurcharge && nightRateInfo.nightSurcharge > 0 && (
                <div className="flex items-start gap-2 mt-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                  <p>
                    <span className="font-semibold">Supplément :</span> {nightRateInfo.nightSurcharge.toFixed(2)}€
                  </p>
                </div>
              )}
              
              <div className="bg-yellow-100 p-3 rounded-md mt-2 border border-yellow-300">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-700 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="font-bold text-yellow-800">
                    Une majoration de {nightRateInfo.percentage}% est appliquée uniquement 
                    sur la portion du trajet effectuée entre {nightRateInfo.nightStart} et {nightRateInfo.nightEnd}
                  </p>
                </div>
              </div>
              
              {nightRateInfo.dayKm !== undefined && nightRateInfo.nightKm !== undefined && (
                <div className="bg-white p-3 rounded-md mt-3 border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2">Détail de la tarification</h4>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-yellow-600 mr-1.5" />
                        <span className="text-sm font-medium">{startTime} à {nightRateInfo.nightStart}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {nightRateInfo.dayKm.toFixed(0)} km
                      </span>
                    </div>
                    
                    {nightRateInfo.dayPrice !== undefined && (
                      <div className="text-sm ml-6 text-gray-600">
                        Prix: {nightRateInfo.dayPrice.toFixed(2)}€
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-yellow-600 mr-1.5" />
                        <span className="text-sm font-medium">{nightRateInfo.nightStart} à {endTime}</span>
                        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                          +{nightRateInfo.percentage}%
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold">
                        {nightRateInfo.nightKm.toFixed(0)} km
                      </span>
                    </div>
                    
                    {nightRateInfo.nightPrice !== undefined && (
                      <div className="text-sm ml-6 text-gray-600">
                        Prix: {nightRateInfo.nightPrice.toFixed(2)}€ (majoration incluse)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {sundayRateInfo?.isApplied && (
        <Alert variant="default" className="bg-orange-50 border-orange-200">
          <Calendar className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-800 text-base font-bold">
            Majoration dimanche/jour férié : +{sundayRateInfo.percentage}%
          </AlertTitle>
          <AlertDescription className="text-orange-700">
            <p>
              Une majoration de {sundayRateInfo.percentage}% est appliquée à l'ensemble de votre trajet
              (dimanche ou jour férié).
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
