
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Settings2 } from 'lucide-react';

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
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Configuration de l'entreprise</CardTitle>
            <CardDescription>
              Personnalisez votre profil d'entreprise et les informations affichées sur vos devis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Settings2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Cette fonctionnalité sera bientôt disponible</h3>
            <p className="mx-auto max-w-md text-muted-foreground">
              Vous pourrez bientôt personnaliser l'apparence de vos devis, ajouter votre logo, 
              configurer vos informations de contact et plus encore.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
