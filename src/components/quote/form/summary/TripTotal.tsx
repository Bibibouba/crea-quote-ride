
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface TripTotalProps {
  totalDistance: number;  
  totalDuration: number;
  totalPrice: number;
}

export const TripTotal: React.FC<TripTotalProps> = ({
  totalDistance,
  totalDuration,
  totalPrice
}) => {
  // Format duration as hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };
  
  return (
    <div className="bg-blue-600 text-white p-6 rounded-lg my-4">
      <h3 className="text-xl font-semibold mb-1">Total</h3>
      <p className="text-sm mb-2">{totalDistance} km • {formatDuration(totalDuration)}</p>
      <p className="text-3xl font-bold">{formatCurrency(totalPrice)}</p>
    </div>
  );
};
