
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClientSimulator = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Simulateur d'interface client</CardTitle>
          <CardDescription>
            Visualisez ce que vos clients verront lors d'une demande de devis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Le simulateur d'interface client sera disponible prochainement.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSimulator;
