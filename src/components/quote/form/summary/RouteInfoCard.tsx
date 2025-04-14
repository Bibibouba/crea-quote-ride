
import { formatDuration } from "@/lib/formatDuration";

interface RouteInfoCardProps {
  departureAddress: string;
  destinationAddress: string;
  estimatedDistance: number;
  estimatedDuration: number;
}

export const RouteInfoCard: React.FC<RouteInfoCardProps> = ({
  departureAddress,
  destinationAddress,
  estimatedDistance,
  estimatedDuration
}) => {
  return (
    <div className="bg-secondary/30 p-4 rounded-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="w-full sm:w-1/2">
          <p className="text-sm font-medium">Départ</p>
          <p className="text-sm text-muted-foreground break-words">{departureAddress}</p>
        </div>
        <div className="w-full sm:w-1/2 sm:text-right">
          <p className="text-sm font-medium">Destination</p>
          <p className="text-sm text-muted-foreground break-words">{destinationAddress}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-4 gap-4">
        <div>
          <p className="text-sm font-medium">Distance estimée</p>
          <p className="text-sm text-muted-foreground">{estimatedDistance} km</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm font-medium">Durée estimée</p>
          <p className="text-sm text-muted-foreground">{formatDuration(estimatedDuration)}</p>
        </div>
      </div>
    </div>
  );
};
