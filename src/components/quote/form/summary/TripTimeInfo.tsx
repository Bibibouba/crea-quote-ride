
import { Clock, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-2">
      {nightRateInfo?.isApplied && (
        <div className="ml-6 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
          <div className="flex items-center mb-2">
            <Moon className="h-5 w-5 mr-2 text-yellow-600" />
            <p className="text-sm font-semibold text-yellow-800">
              Supplément tarif de nuit
            </p>
          </div>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>
              <strong>Période de nuit :</strong> De {nightRateInfo.nightStart} à {nightRateInfo.nightEnd}
            </p>
            <p>
              <strong>Durée en tarif de nuit :</strong> {Math.round(nightRateInfo.nightHours * 10) / 10}h 
              sur un total de {Math.round(nightRateInfo.totalHours * 10) / 10}h
            </p>
            <p>
              <strong>Majoration :</strong> +{nightRateInfo.percentage}% uniquement sur la portion de nuit
            </p>
            <div className="bg-yellow-100 p-2 rounded mt-2">
              <p className="font-bold text-yellow-900">
                ⚠️ Attention : Supplément de {nightRateInfo.percentage}% appliqué 
                entre {nightRateInfo.nightStart} et {nightRateInfo.nightEnd}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {sundayRateInfo?.isApplied && (
        <div className="ml-6 bg-muted/40 p-2 rounded-md mt-2">
          <div className="flex items-center mb-1">
            <Badge variant="outline" className="h-5 text-xs">Dimanche</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Majoration dimanche/jour férié de {sundayRateInfo.percentage}% appliquée sur l'ensemble du trajet.
          </p>
        </div>
      )}
    </div>
  );
};
