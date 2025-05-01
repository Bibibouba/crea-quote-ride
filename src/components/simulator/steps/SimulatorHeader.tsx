
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SimulatorHeaderProps {
  isWidget?: boolean;
  companyName?: string;
  logoUrl?: string;
}

const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({ 
  isWidget = false,
  companyName,
  logoUrl
}) => {
  return (
    <CardHeader>
      <CardTitle>{isWidget 
        ? `Devis VTC - ${companyName || 'Simulateur de tarifs'}`
        : 'Simulateur d\'interface client'}
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        {isWidget 
          ? 'Obtenez un devis instantané pour votre trajet'
          : 'Visualisez ce que vos clients verront lors d\'une demande de devis'}
      </CardDescription>
    </CardHeader>
  );
};

export default SimulatorHeader;
