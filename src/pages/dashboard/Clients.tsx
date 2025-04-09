
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ClientsList from '@/components/clients/ClientsList';
import ClientForm from '@/components/clients/ClientForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, X } from 'lucide-react';

const Clients = () => {
  const [showForm, setShowForm] = useState(false);

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
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          )}
        </div>

        {showForm ? (
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Nouveau client</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowForm(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ClientForm 
                onSuccess={() => setShowForm(false)} 
                onCancel={() => setShowForm(false)} 
              />
            </CardContent>
          </Card>
        ) : (
          <ClientsList />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Clients;
