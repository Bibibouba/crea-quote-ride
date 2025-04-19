
import React from 'react';

interface VehicleRateInfoProps {
  vehicleName: string;
  nightStart: string;
  nightEnd: string;
}

export const VehicleRateInfo: React.FC<VehicleRateInfoProps> = ({
  vehicleName,
  nightStart,
  nightEnd
}) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-border mb-4">
      <div className="flex items-center mb-2">
        <span className="text-base font-medium">🚗 Véhicule {vehicleName}</span>
      </div>
      
      <div className="flex justify-between text-sm mt-2">
        <div>Tarif jour: {nightEnd} - {nightStart}</div>
        <div>Tarif nuit: {nightStart} - {nightEnd}</div>
      </div>
      
      <div className="flex mt-3 gap-4">
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
    </div>
  );
};
