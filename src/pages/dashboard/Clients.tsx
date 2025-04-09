
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ClientsList from '@/components/clients/ClientsList';
import ClientDialog from '@/components/clients/ClientDialog';

const Clients = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mes clients</h1>
            <p className="text-muted-foreground">
              Consultez et gérez votre carnet de clients.
            </p>
          </div>
          <ClientDialog />
        </div>

        <ClientsList />
      </div>
    </DashboardLayout>
  );
};

export default Clients;
