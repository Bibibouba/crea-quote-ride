
import React from 'react';
import { Loader2 } from 'lucide-react';

const SimulatorLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="flex items-center">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Chargement des données...
      </p>
    </div>
  );
};

export default SimulatorLoading;
