
import { Separator } from '@/components/ui/separator';
import { Clock, Moon, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export interface NightRateInfo {
  isApplied: boolean;
  percentage: number;
  nightHours: number;
  totalHours: number;
  nightStart: string;
  nightEnd: string;
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
              <p>
                Votre trajet inclut <span className="font-bold">{Math.round(nightRateInfo.nightHours * 10) / 10} heures</span> en 
                tarif de nuit (sur un total de {Math.round(nightRateInfo.totalHours * 10) / 10}h).
              </p>
              <p>
                <span className="font-semibold">Période de nuit :</span> De {nightRateInfo.nightStart} à {nightRateInfo.nightEnd}
              </p>
              <div className="bg-yellow-100 p-3 rounded-md mt-2 border border-yellow-300">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-700 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="font-bold text-yellow-800">
                    Une majoration de {nightRateInfo.percentage}% est appliquée uniquement 
                    sur la portion du trajet effectuée entre {nightRateInfo.nightStart} et {nightRateInfo.nightEnd}
                  </p>
                </div>
              </div>
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
