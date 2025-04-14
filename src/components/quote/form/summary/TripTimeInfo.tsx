
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
        <div className="ml-6 bg-muted/40 p-2 rounded-md">
          <div className="flex items-center mb-1">
            <Moon className="h-3 w-3 mr-1 text-amber-500" />
            <p className="text-xs font-medium">
              Tarif de nuit ({nightRateInfo.percentage}% de majoration)
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Ce trajet débute à {startTime} et se termine à {endTime}.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>{Math.round(nightRateInfo.nightHours * 10) / 10}h</strong> du trajet sont en horaire de nuit 
            (entre {nightRateInfo.nightStart} et {nightRateInfo.nightEnd}).
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            La majoration s'applique uniquement à cette portion du trajet.
          </p>
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
