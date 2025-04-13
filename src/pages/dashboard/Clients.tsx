
import React from 'react';
import { ClientsList } from '@/components/clients/ClientsList';
import { useClientsFilterStore } from '@/hooks/useClientsFilterStore';

const ClientsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Gérez vos clients et visualisez leurs informations
        </p>
      </div>
      <ClientsList />
    </div>
  );
};

export default ClientsPage;
