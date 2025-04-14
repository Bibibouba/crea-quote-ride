
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SimulatorHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Simulateur d'interface client</CardTitle>
      <CardDescription>
        Visualisez ce que vos clients verront lors d'une demande de devis
      </CardDescription>
    </CardHeader>
  );
};

export default SimulatorHeader;
