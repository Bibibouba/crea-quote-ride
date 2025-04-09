
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Pricing = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des tarifs</h1>
          <p className="text-muted-foreground">
            Définissez vos tarifs pour chaque véhicule et type de service
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-center">
          <h3 className="text-lg font-medium">Cette fonctionnalité sera bientôt disponible</h3>
          <p className="mt-2 text-muted-foreground">
            Vous pourrez bientôt configurer vos tarifs par kilomètre, tarifs d'attente, et frais supplémentaires.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
