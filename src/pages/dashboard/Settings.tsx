
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Personnalisez vos devis et gérez vos informations
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-center">
          <h3 className="text-lg font-medium">Cette fonctionnalité sera bientôt disponible</h3>
          <p className="mt-2 text-muted-foreground">
            Vous pourrez bientôt personnaliser l'apparence de vos devis, ajouter votre logo et configurer vos informations de contact.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
