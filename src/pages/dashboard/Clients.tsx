
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ClientsList from '@/components/clients/ClientsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

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
        </div>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              <CardTitle>Liste des clients</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ClientsList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
