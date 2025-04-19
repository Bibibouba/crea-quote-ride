
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
    </div>
  );
};
